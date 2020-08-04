import * as nearApiJs from 'near-api-js'
import { store } from '..'
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
        const { account, has2fa } = await this.wallet.getAccountAndState();
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
        let { requestId, data } = requestData
        if (!requestId && requestId !== 0) {
            console.log('no pending multisig requestId found, assuming account setup')
            requestId = -1
        }
        return this.sendRequest(accountId, method, requestId, data)
    }

    // requestId is optional, if included the server will try to confirm requestId
    async verifyTwoFactor(accountId, securityCode) {
        const requestData = getRequest()
        console.log(requestData)
        let { requestId } = requestData
        if (!requestId && requestId !== 0) {
            console.log('no pending multisig requestId found, assuming account setup')
            requestId = -1
        }
        // try to get a accountId for the request
        if (!accountId) accountId = requestData.accountId || this.wallet.accountId
        if (!accountId) {
            console.error('no pending multisig accountId found')
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
        const contract = new nearApiJs.Contract(account, account.accountId, {
            viewMethods: VIEW_METHODS,
            changeMethods: METHOD_NAMES_LAK,
            sender: account.accountId
        });
        // await deleteUnconfirmedRequests(contract)
        const request_id = await getNextRequestId(contract)
        try {
            await contract.add_request_and_confirm({ request })
        } catch (e) {
            throw(e)
        }
        const request_id_after = await getNextRequestId(contract)
        if (request_id_after > request_id) {
            const data = { request_id, request }
            const method = await this.get2faMethod()
            return await this.sendRequest(accountId, method, request_id, data)
        }
    }

    async addKey(account, publicKey, contractId, fullAccess = false) {
        const {accountId} = account
        const accessKeys = await this.wallet.getAccessKeys(accountId)
        if (accessKeys.find((ak) => ak.public_key.toString() === publicKey)) {
            throw new Error(`key already exists for account ${accountId}`)
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
        for (let { receiverId, nonce, blockHash, actions } of transactions) {
            console.log(receiverId, nonce, blockHash, actions)
            actions = actions.map((a) => {
                const action = {
                    ...a[a.enum],
                    type: actionTypes[a.enum],
                }
                if (action.gas) action.gas = action.gas.toString()
                if (action.deposit) action.deposit = action.deposit.toString()
                if (action.args) action.args = btoa(new TextDecoder().decode(new Uint8Array(action.args)))
                if (action.methodName) {
                    action.method_name = action.methodName
                    delete action.methodName
                }
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
            return store.dispatch(promptTwoFactor(true)).payload.store.promise
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
        const getAccessKey = await this.wallet.postSignedJson('/2fa/getAccessKey', {
            accountId
        })
        if (!getAccessKey || !getAccessKey.success || !getAccessKey.publicKey) {
            throw new Error('error getting publicKey from contract-helper')
        }
        const confirmOnlyKey = toPK(getAccessKey.publicKey)
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

// WIP: nonce issues causing havoc with this method
// const deleteUnconfirmedRequests = async (contract) => {
//     const request_ids = await contract.list_request_ids().catch((e) => { console.log(e) })
//     if (!request_ids || request_ids.length === 0) {
//         return
//     }
//     const promises = []
//     // try to unconfirmed requests using current pk, catch exceptions, fail fast so other promises can run

//     // let's log these until we debug the nonce / timeout
//     for (const request_id of request_ids) {
//         promises.push(contract.delete_request({ request_id }).catch((e) => console.log(e)))
//     }
//     try {
//         await Promise.all(promises)
//     } catch (e) {
//         // take no action if request cannot be deleted (probably due to cooldown period for new request)
//         console.log(e)
//     }
// }

const getNextRequestId = async (contract) => {
    try {
        return contract.get_request_nonce()
    } catch (e) {
        throw(e)
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
