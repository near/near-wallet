import * as nearApiJs from 'near-api-js'
import { store } from '..'
import { WalletError } from './walletError'
import { promptTwoFactor } from '../actions/account'
import { ACCESS_KEY_FUNDING_AMOUNT, convertPKForContract, toPK } from './wallet'

const {
    transactions: { deleteKey, addKey, functionCall, functionCallAccessKey, deployContract },
    Account
} = nearApiJs

export const METHOD_NAMES_LAK = ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm']
const VIEW_METHODS = ['get_request_nonce', 'list_request_ids']
const METHOD_NAMES_CONFIRM = ['confirm']
const LAK_ALLOWANCE = process.env.LAK_ALLOWANCE || '10000000000000'
// TODO: Parse it from env variable, cannot just pass array
const MULTISIG_CONTRACT_HASHES = process.env.MULTISIG_CONTRACT_HASHES || ['7GQStUCd8bmCK43bzD8PRh7sD2uyyeMJU5h8Rj3kXXJk'];


class TwoFactorAccount extends Account {
    constructor(connection, accountId, twoFactor) {
        super(connection, accountId);
        this.twoFactor = twoFactor;
    }

    async signAndSendTransaction(receiverId, actions) {
        const state = await this.state()
        const has2fa = MULTISIG_CONTRACT_HASHES.includes(state.code_hash)

        if (has2fa) {
            return this.twoFactor.signAndSendTransactions(this, [{ receiverId, actions }]);
            // TODO: Should this wait for smth else as well (like request confirmed?)
        }

        return super.signAndSendTransaction(receiverId, actions);
    }
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

    getAccount(connection, accountId) {
        return new TwoFactorAccount(connection, accountId, this);
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
        let { requestId, data } = requestData
        if (!requestId && requestId !== 0) {
            requestId = -1
        }
        return this.sendRequest(accountId, method, requestId, data)
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

    async request(account, request) {
        if (this.wallet.tempTwoFactorAccount) account = this.wallet.tempTwoFactorAccount
        const { accountId } = account
        const contract = getContract(account)
        await deleteUnconfirmedRequests(contract)
        const request_id = await contract.get_request_nonce()
        await contract.add_request_and_confirm({ request })
        const request_id_after = await contract.get_request_nonce()
        if (request_id_after > request_id) {
            const data = { request_id, request }
            const method = await this.get2faMethod()
            return await this.sendRequest(accountId, method, request_id, data)
        }
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
                const lowercaseType = a.enum
                const { gas, deposit, args, methodName } = a[lowercaseType]

                console.log('a', a);
                const type = lowercaseType[0].toUpperCase() + lowercaseType.substring(1)
                const action = {
                    type,
                    gas: gas && gas.toString() || undefined,
                    deposit: deposit && deposit.toString() || undefined,
                    args: args && Buffer.from(args).toString('base64') || undefined,
                    method_name: methodName
                }

                // TODO: Why rename is needed? Shoud just make contract match near-api-js names?
                if (action.type === 'Transfer') {
                    action.amount = action.deposit
                    delete action.deposit
                }

                console.log('action', action)
                return action
            })
            await this.request(account, { receiver_id: receiverId, actions })
        }
    }

    async sendRequest(accountId, method, requestId = -1, data = {}) {
        if (!accountId) accountId = this.wallet.accountId
        if (!method) method = await this.get2faMethod()
        // add request to local storage
        setRequest({ accountId, requestId, data })
        try {
            await this.wallet.postSignedJson('/2fa/send', {
                accountId,
                method,
                requestId,
                data
            })
        } catch (e) {
            throw(e)
        }
        if (requestId !== -1) {
            const result = await store.dispatch(promptTwoFactor(true)).payload.promise
            if (!result) {
                throw new WalletError('Request was cancelled.', 'errors.twoFactor.userCancelled')
            }
            return result
        }
    }

    async deployMultisig() {
        const accountData = await this.wallet.loadAccount()
        const contractBytes = new Uint8Array(await (await fetch('/multisig.wasm')).arrayBuffer())
        const { accountId } = accountData
        const account = new Account(this.wallet.connection, this.wallet.accountId)
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


const getContract = (account) => {
    // NOTE: Need to avoid using non-raw Account
    // TODO: Avoid creating new instance each time? Or use per-connection nonce cache in near-api-js?
    account = new Account(account.connection, account.accountId)
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


// TODO: Remove this stuff (instead do part of it when converting actions)
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
