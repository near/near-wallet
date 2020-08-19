import * as nearApiJs from 'near-api-js'
import { store } from '..'
import { WalletError } from './walletError'
import { promptTwoFactor } from '../actions/account'
import { ACCESS_KEY_FUNDING_AMOUNT, convertPKForContract, toPK } from './wallet'

const { transactions: {
    deleteKey, addKey, functionCall, functionCallAccessKey, deployContract
}} = nearApiJs
export const METHOD_NAMES_LAK = ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm']
const VIEW_METHODS = ['get_request_nonce', 'list_request_ids']
const METHOD_NAMES_CONFIRM = ['confirm']
const LAK_ALLOWANCE = process.env.LAK_ALLOWANCE || '10000000000000'
const actionTypes = {
    'functionCall': 'FunctionCall'
}

export class TwoFactor {
    constructor(wallet) {
        this.wallet = wallet
    }

    async get2faMethod() {
        const { account, has2fa } = await this.wallet.getAccountAndState(this.wallet.accountId);
        if (has2fa) {
            return (await this.wallet.getRecoveryMethods(account)).data.filter((m) => m.kind.indexOf('2fa-') > -1).map(({ kind, detail, createdAt }) => ({ kind, detail, createdAt }))[0]
        }
    }

    async initTwoFactor(accountId, method) {
        // clear any previous requests in localStorage (for verifyTwoFactor)
        setRequest({})
        return await this.wallet.postSignedJson('/2fa/init', {
            accountId,
            method
        });
    }

    async reInitTwoFactor(accountId, method) {
        // clear any previous requests in localStorage (for verifyTwoFactor)
        setRequest({})
        return this.sendRequest(accountId, method)
    }

    async resend(accountId, method) {
        if (!accountId) accountId = this.wallet.accountId
        if (!method) method = await this.get2faMethod()
        const requestData = getRequest()
        let { requestId } = requestData
        if (!requestId && requestId !== 0) {
            requestId = -1
        }
        return this.sendRequest(accountId, method, requestId)
    }

    // requestId is optional, if included the server will try to confirm requestId
    async verifyTwoFactor(accountId, securityCode) {
        if (this.wallet.tempTwoFactorAccount) {
            accountId = this.wallet.tempTwoFactorAccount.accountId
        }
        const requestData = getRequest()
        let { requestId } = requestData
        if (!requestId && requestId !== 0) {
            requestId = -1
        }
        // try to get a accountId for the request
        if (!accountId) accountId = requestData.accountId || this.wallet.accountId
        if (!accountId) {
            return
        }
        return await this.wallet.postSignedJson('/2fa/verify', {
            accountId,
            securityCode,
            requestId
        });
    }

    async sendMoney(account, receiver_id, amount) {
        const request = {
            receiver_id,
            actions: [{ type: 'Transfer', amount }]
        }
        return await this.request(account, request)
    }

    async request(account, request) {
        if (this.wallet.tempTwoFactorAccount) account = this.wallet.tempTwoFactorAccount
        const { accountId } = account
        const contract = getContract(account, accountId)
        await deleteUnconfirmedRequests(contract)
        const request_id = await contract.get_request_nonce()
        await contract.add_request_and_confirm({ request })
        const request_id_after = await contract.get_request_nonce()
        if (request_id_after > request_id) {
            const method = await this.get2faMethod()
            return await this.sendRequest(accountId, method, request_id)
        }
    }

    async addKey(account, publicKey, contractId, fullAccess = false) {
        const {accountId} = account
        const accessKeys = await this.wallet.getAccessKeys(accountId)
        if (accessKeys.find((ak) => ak.public_key.toString() === publicKey)) {
            // TODO check access key receiver_id matches contractId desired
            return true
        }
        const request = {
            receiver_id: account.accountId,
            actions: [addKeyAction(account, publicKey, contractId, fullAccess)]
        }
        return await this.request(account, request)
    }

    async removeKey(account, publicKey) {
        const request = {
            receiver_id: account.accountId,
            actions: [deleteKeyAction(publicKey)]
        }
        return await this.request(account, request)
    }

    async rotateKeys(account, addPublicKey, removePublicKey) {
        const { accountId } = account
        const request = {
            receiver_id: accountId,
            actions: [
                addKeyAction(account, addPublicKey, accountId),
                deleteKeyAction(removePublicKey)
            ]
        }
        return await this.request(account, request)
    }

    async signAndSendTransactions(account, transactions) {
        for (let { receiverId, actions } of transactions) {
            actions = actions.map((a) => {
                const action = {
                    ...a[a.enum],
                    type: actionTypes[a.enum],
                }
                if (action.gas) action.gas = action.gas.toString()
                if (action.deposit) action.deposit = action.deposit.toString()
                if (action.args && Array.isArray(action.args)) action.args = Buffer.from(action.args).toString('base64')
                if (action.methodName) {
                    action.method_name = action.methodName
                    delete action.methodName
                }
                return action
            })
            await this.request(account, { receiver_id: receiverId, actions })
        }
    }

    async sendRequest(accountId, method, requestId = -1) {
        if (!accountId) accountId = this.wallet.accountId
        if (!method) method = await this.get2faMethod()
        // add request to local storage
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
                    // TODO @patrick please update messaging/translation for invalid 2fa code
                    throw new WalletError(e.message, 'errors.twoFactor.userCancelled')
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
            ...fak2lak.map((pk) => addKey(pk, functionCallAccessKey(accountId, METHOD_NAMES_LAK, null))),
            addKey(confirmOnlyKey, functionCallAccessKey(accountId, METHOD_NAMES_CONFIRM, null)),
            deployContract(contractBytes),
            functionCall('new', newArgs, LAK_ALLOWANCE, '0'),
        ]
        console.log('deploying multisig contract for', accountId)
        return await account.signAndSendTransaction(accountId, actions);
    }
}

const getContract = (account, accountId) => {
    return new nearApiJs.Contract(account, account.accountId, {
        viewMethods: VIEW_METHODS,
        changeMethods: METHOD_NAMES_LAK,
    });
}

const deleteUnconfirmedRequests = async (contract) => {
    const request_ids = await contract.list_request_ids().catch((e) => { console.log(e) })
    if (!request_ids || request_ids.length === 0) {
        return
    }
    for (const request_id of request_ids) {
        try {
            await contract.delete_request({ request_id })
        } catch(e) {
            console.warn(e)
        }
    }
}

const getRequest = () => {
    return JSON.parse(localStorage.getItem(`__multisigRequest`) || `{}`)
}

const setRequest = (data) => {
    localStorage.setItem(`__multisigRequest`, JSON.stringify(data))
}

const addKeyAction = (account, publicKey, contractId, fullAccess = false) => {
    const { accountId } = account
    if (!contractId) contractId = accountId
    let allowance = ACCESS_KEY_FUNDING_AMOUNT
    let method_names = METHOD_NAMES_LAK
    if (contractId !== accountId) {
        fullAccess = false
        method_names = ['']
    } else {
        allowance = '0'
    }
    return {
        type: 'AddKey',
        public_key: convertPKForContract(publicKey),
        ...(!fullAccess ? {
            permission: {
                receiver_id: contractId,
                allowance,
                method_names
            }
        } : null)
    }
}

const deleteKeyAction = (publicKey) => ({ type: 'DeleteKey', public_key: convertPKForContract(publicKey) })
