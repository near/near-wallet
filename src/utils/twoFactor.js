import * as nearApiJs from 'near-api-js'
import { store } from '..'
import { WalletError } from './walletError'
import { promptTwoFactor } from '../actions/account'
import { convertPKForContract, toPK } from './wallet'

const { 
    Account,
    transactions: { deleteKey, addKey, functionCall, functionCallAccessKey, deployContract }
} = nearApiJs
export const METHOD_NAMES_LAK = ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm']
const VIEW_METHODS = ['get_request_nonce', 'list_request_ids']
const METHOD_NAMES_CONFIRM = ['confirm']
const GAS_2FA = process.env.REACT_APP_GAS_2FA || '100000000000000'
const ALLOWANCE_2FA = process.env.ALLOWANCE_2FA || nearApiJs.utils.format.parseNearAmount('1')

export class TwoFactor extends Account {
    constructor(wallet) {
        super(wallet.connection, wallet.accountId)
        this.accountId = wallet.accountId
        this.wallet = wallet
    }

    getAccount() {
        let account = this
        if (this.wallet.recoveryAccount) {
            account = this.wallet.recoveryAccount
        }
        return account
    }

    async get2faMethod() {
        if (!this.wallet.has2fa) {
            return null
        }
        return (await this.wallet.getRecoveryMethods())
            .data.filter((m) => m.kind.indexOf('2fa-') > -1)
            .map(({ kind, detail, createdAt }) => ({ kind, detail, createdAt }))[0]
    }

    async initTwoFactor(accountId, method) {
        // clear any previous requests in localStorage (for verifyTwoFactor)
        setRequest({})
        return await this.wallet.postSignedJson('/2fa/init', {
            accountId,
            method
        });
    }

    async reInitTwoFactor() {
        // clear any previous requests in localStorage (for verifyTwoFactor)
        setRequest({})
        return this.sendRequest()
    }

    async resend() {
        const requestData = getRequest()
        let { requestId } = requestData
        if (!requestId && requestId !== 0) {
            requestId = -1
        }
        return this.sendRequest(requestId)
    }

    // requestId is optional, if included the server will try to confirm requestId
    async verifyTwoFactor(accountId, securityCode) {
        const requestData = getRequest()
        let { requestId } = requestData
        if (!requestId && requestId !== 0) {
            requestId = -1
        }
        if (!accountId) accountId = this.getAccount().accountId
        return await this.wallet.postSignedJson('/2fa/verify', {
            accountId,
            securityCode,
            requestId
        });
    }

    async sendRequest(requestId = -1) {
        const { accountId } = this.wallet
        const method = await this.get2faMethod()
        setRequest({ accountId, requestId })
        await this.wallet.postSignedJson('/2fa/send', {
            accountId,
            method,
            requestId,
        })
        if (requestId !== -1 && !store.getState().account.requestPending) {
            try {
                return await store.dispatch(promptTwoFactor(true)).payload.promise
            } catch (e) {
                if (e.message.indexOf('not valid') > -1) {
                    throw new WalletError(e.message, 'errors.twoFactor.invalidCode')
                }
                throw e
            }
        }
    }

    async deployMultisig() {
        const accountData = await this.wallet.loadAccount()
        const contractBytes = new Uint8Array(await (await fetch('/multisig.wasm')).arrayBuffer())
        const { accountId } = accountData
        const account = this.wallet.getAccount(accountId)
        const accountKeys = await account.getAccessKeys();
        const recoveryMethods = await this.wallet.getRecoveryMethods()
        const recoveryKeysED = recoveryMethods.data.map((rm) => rm.publicKey)
        const fak2lak = recoveryMethods.data.filter(({ kind, publicKey }) => kind !== 'phrase' && publicKey !== null).map((rm) => toPK(rm.publicKey))
        fak2lak.push(...accountKeys.filter((ak) => !recoveryKeysED.includes(ak.public_key)).map((ak) => toPK(ak.public_key)))
        const getPublicKey = await this.wallet.postSignedJson('/2fa/getAccessKey', { accountId })
        const confirmOnlyKey = toPK(getPublicKey.publicKey)
        const newArgs = new Uint8Array(new TextEncoder().encode(JSON.stringify({ 'num_confirmations': 2 })));
        const actions = [
            ...fak2lak.map((pk) => deleteKey(pk)),
            ...fak2lak.map((pk) => addKey(pk, functionCallAccessKey(accountId, METHOD_NAMES_LAK, ALLOWANCE_2FA))),
            addKey(confirmOnlyKey, functionCallAccessKey(accountId, METHOD_NAMES_CONFIRM, ALLOWANCE_2FA)),
            deployContract(contractBytes),
            functionCall('new', newArgs, GAS_2FA, '0'),
        ]
        console.log('deploying multisig contract for', accountId)
        return await account.signAndSendTransaction(accountId, actions);
    }

    async rotateKeys(addPublicKey, removePublicKey) {
        const { accountId } = this.getAccount()
        return await this.signAndSendTransaction(accountId, [
            addKey(addPublicKey, functionCallAccessKey(accountId, METHOD_NAMES_LAK, ALLOWANCE_2FA)),
            deleteKey(removePublicKey)
        ])
    }

    async signAndSendTransaction(receiverId, actions) {
        const account = this.getAccount()
        const { accountId } = account
        const contract = getContract(account)
        if (actions[0]?.functionCall?.methodName === 'delete_request') {
            return await super.signAndSendTransaction(accountId, actions)
        }
        await deleteUnconfirmedRequests(contract)
        const requestId = await contract.get_request_nonce()
        const args = new Uint8Array(new TextEncoder().encode(JSON.stringify({
            request: {
                receiver_id: receiverId,
                actions: convertActions(actions, accountId, receiverId)
            }
        })));
        try {
            await super.signAndSendTransaction(accountId, [
                functionCall('add_request_and_confirm', args, GAS_2FA, '0')
            ])
            await this.sendRequest(requestId)
        } catch (e) {
            throw new WalletError('Error creating request')
        }
    }

    async signAndSendTransactions(transactions) {
        for (let { receiverId, actions } of transactions) {
            await this.signAndSendTransaction(receiverId, actions)
        }
    }
}

const convertActions = (actions, accountId, receiverId) => actions.map((a) => {
    const type = a.enum
    const { gas, publicKey, methodName, args } = a[type]
    const action = {
        ...a[type],
        type: type[0].toUpperCase() + type.substr(1),
        gas: (gas && gas.toString()) || undefined,
        public_key: (publicKey && convertPKForContract(publicKey)) || undefined,
        method_name: methodName,
        args: (args && Buffer.from(args).toString('base64')) || undefined,
    }
    delete action.publicKey
    delete action.methodName
    if (action.deposit) {
        action.deposit = action.amount = action.deposit.toString()
    }
    if (action.accessKey) {
        if (receiverId === accountId && action.accessKey.permission.enum !== 'fullAccess') {
            action.permission = {
                receiver_id: accountId,
                allowance: ALLOWANCE_2FA,
                method_names: METHOD_NAMES_LAK,
            }
        }
        if (action.accessKey.permission.enum === 'functionCall') {
            const { receiverId: receiver_id, methodNames: method_names, allowance,  } = action.accessKey.permission.functionCall
            action.permission = { receiver_id, allowance, method_names }
        }
        delete action.accessKey
    }
    return action
})

const getContract = (account) => {
    return new nearApiJs.Contract(account, account.accountId, {
        viewMethods: VIEW_METHODS,
        changeMethods: METHOD_NAMES_LAK,
    });
}

const deleteUnconfirmedRequests = async (contract) => {
    const request_ids = await contract.list_request_ids()
    for (const request_id of request_ids) {
        // TODO discuss if need to show these errors; request cooldown prevents deletion and contract panics. Error is pretty useless to console.warn
        await contract.delete_request({ request_id }).catch((e) => {})
    }
}

const getRequest = () => {
    return JSON.parse(localStorage.getItem(`__multisigRequest`) || `{}`)
}

const setRequest = (data) => {
    localStorage.setItem(`__multisigRequest`, JSON.stringify(data))
}
