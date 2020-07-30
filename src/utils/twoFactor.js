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
/********************************
Helpers
********************************/
const deleteUnconfirmedRequests = async (contract) => {
    const request_ids = await contract.list_request_ids().catch((e) => { console.log(e) })
    if (!request_ids || request_ids.length === 0) {
        return
    }
    const promises = []
    // try to unconfirmed requests using current pk, catch exceptions, fail fast so other promises can run
    for (const request_id of request_ids) {
        promises.push(contract.delete_request({ request_id }).catch((e) => console.log(e)))
    }
    try {
        await Promise.all(promises)
    } catch (e) {
        // take no action if request cannot be deleted (probably due to cooldown period for new request)
        console.log(e)
    }
}
const getNextRequestId = async (contract) => {
    try {
        return contract.get_request_nonce()
    } catch (e) {
        throw(e)
    }
}
const addRequestAndConfirm = async (contract, request) => {
    try {
        return contract.add_request_and_confirm({ request })
    } catch (e) {
        throw(e)
    }
}
const getContract = (account) => {
    return new nearApiJs.Contract(account, account.accountId, {
        viewMethods: VIEW_METHODS,
        changeMethods: METHOD_NAMES_LAK,
        sender: account.accountId
    });
}
/********************************
Exports
********************************/
export const addKeyAction = (account, publicKey, contractId, fullAccess = false) => {
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

export const deleteKeyAction = (publicKey) => ({ type: 'DeleteKey', public_key: convertPKForContract(publicKey) })

export const getRequest = () => {
    return JSON.parse(localStorage.getItem(`__multisigRequest`) || `{}`)
}

export const setRequest = (data) => {
    localStorage.setItem(`__multisigRequest`, JSON.stringify(data))
}

export const sendTwoFactorRequest = async (wallet, accountId, method, requestId = -1, data = {}) =>  {
    if (!accountId) accountId = wallet.accountId
    if (!method) method = await wallet.get2faMethod()
    // add request to local storage
    setRequest({ accountId, requestId, data })
    try {
        await wallet.postSignedJson('/2fa/send', {
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

export const twoFactorRequest = async (wallet, account, request) => {
    if (wallet.tempTwoFactorAccount) account = wallet.tempTwoFactorAccount
    const { accountId } = account
    const contract = getContract(account)
    // await deleteUnconfirmedRequests(contract)
    const request_id = await getNextRequestId(contract)
    await addRequestAndConfirm(contract, request)
    const request_id_after = await getNextRequestId(contract)
    if (request_id_after > request_id) {
        const data = { request_id, request }
        const method = await wallet.get2faMethod()
        return await sendTwoFactorRequest(wallet, accountId, method, request_id, data)
    }
}

export const twoFactorAddKey = async (wallet, account, publicKey, contractId, fullAccess = false) => {
    const {accountId} = account
    const accessKeys = await wallet.getAccessKeys(accountId)
    if (accessKeys.find((ak) => ak.public_key.toString() === publicKey)) {
        throw new Error(`key already exists for account ${accountId}`)
    }
    const request = {
        receiver_id: account.accountId,
        actions: [addKeyAction(account, publicKey, contractId, fullAccess)]
    }
    return await twoFactorRequest(wallet, account, request)
}

export const twoFactorRemoveKey = (wallet, account, publicKey) => {
    const request = {
        receiver_id: account.accountId,
        actions: [deleteKeyAction(publicKey)]
    }
    return twoFactorRequest(wallet, account, request)
}
/********************************
Deploys 2/3 multisig contract with keys from contract-helper and localStorage
@todo check account has enough near to actually do this
********************************/
export const twoFactorDeploy = async (wallet) => {
    const accountData = await wallet.loadAccount()
    const contractBytes = new Uint8Array(await (await fetch('/multisig.wasm')).arrayBuffer())
    const { accountId } = accountData
    const account = wallet.getAccount(accountId)
    const accountKeys = await account.getAccessKeys();
    const recoveryMethods = await wallet.getRecoveryMethods()
    const recoveryKeysED = recoveryMethods.data.map((rm) => rm.publicKey)
    const fak2lak = recoveryMethods.data.filter(({ kind, publicKey }) => kind !== 'phrase' && publicKey !== null).map((rm) => toPK(rm.publicKey))
    fak2lak.push(...accountKeys.filter((ak) => !recoveryKeysED.includes(ak.public_key)).map((ak) => toPK(ak.public_key)))
    const getAccessKey = await wallet.postSignedJson('/2fa/getAccessKey', {
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