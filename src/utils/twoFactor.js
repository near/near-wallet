import * as nearApiJs from 'near-api-js'
import { store } from '..'
import { promptTwoFactor } from '../actions/account'
import { ACCESS_KEY_FUNDING_AMOUNT, splitPK, toPK } from './wallet'

export const METHOD_NAMES_LAK = ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm']
const VIEW_METHODS = ['get_request_nonce', 'list_request_ids']
const METHOD_NAMES_CONFIRM = ['confirm']
/********************************
Helpers
********************************/
const deleteUnconfirmedRequests = async (contract) => {
    const request_ids = await contract.list_request_ids().catch((e) => { console.log(e) })
    if (!request_ids || request_ids.length === 0) {
        return
    }
    console.log(request_ids)
    const promises = []
    // try to unconfirmed requests using current pk, catch exceptions, fail fast so other promises can run
    for (let i = 0; i < request_ids.length; i++) {
        promises.push(contract.delete_request({ request_id: request_ids[i] }).catch((e) => console.log(e)))
    }
    try {
        await Promise.all(promises)
    } catch (e) {
        // take no action if request cannot be deleted (probably due to cooldown period for new request)
        console.log(e)
    }
}
const getNextRequestId = async (contract) => {
    return contract.get_request_nonce().catch((e) => { console.log(e) })
}
const addRequestAndConfirm = async (contract, request) => {
    return contract.add_request_and_confirm({ request }).catch((e) => console.log(e))
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
        public_key: splitPK(publicKey),
        ...(!fullAccess ? {
            permission: {
                receiver_id: contractId,
                allowance,
                method_names
            }
        } : null)
    }
}

export const deleteKeyAction = (publicKey) => ({ type: 'DeleteKey', public_key: splitPK(publicKey) })

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

    const serverResponse = wallet.postSignedJson('/2fa/send', {
        accountId,
        method,
        requestId,
        data
    }).catch((e) => console.log('/2fa/send failed', e));
    
    if (requestId !== -1) {
        return new Promise((resolve) => {
            store.dispatch(promptTwoFactor((verified) => {
                if (verified) {
                    wallet.tempTwoFactorAccount = null
                }
                resolve(verified)
            }))
        })
    } else {
        return await serverResponse
    }
}

export const twoFactorRequest = async (wallet, account, request) => {
    if (wallet.tempTwoFactorAccount) account = wallet.tempTwoFactorAccount
    const { accountId } = account
    console.log('makeTwoFactorRequest', accountId, request, account)
    const contract = getContract(account)
    await deleteUnconfirmedRequests(contract)
    const request_id = await getNextRequestId(contract)
    await addRequestAndConfirm(contract, request)
    const request_id_after = await getNextRequestId(contract)
    if (request_id_after > request_id) {
        const data = { request_id, request }
        const method = await wallet.get2faMethod()
        return await sendTwoFactorRequest(wallet, accountId, method, request_id, data)
    }
}

export const twoFactorAddKey = (wallet, account, publicKey, contractId, fullAccess = false) => {
    const request = {
        receiver_id: account.accountId,
        actions: [addKeyAction(account, publicKey, contractId, fullAccess)]
    }
    return twoFactorRequest(wallet, account, request)
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
    // get multisig contract to deploy
    const contractBytes = new Uint8Array(await fetch('/multisig.wasm').then((res) => res.arrayBuffer()))
    // get account
    const { accountId } = accountData
    const account = wallet.getAccount(accountId)
    // 1. get localstorage keys
    const accountKeys = await account.getAccessKeys();
    // 2. get recovery method keys
    const recoveryMethods = await wallet.getRecoveryMethods()
    const recoveryKeysED = recoveryMethods.data.map((rm) => rm.publicKey)
    // 3. get recovery keys that are NOT seed phrases && NOT null publicKey
    const fak2lak = recoveryMethods.data.filter(({ kind, publicKey }) => kind !== 'phrase' && publicKey !== null).map((rm) => toPK(rm.publicKey))
    // 4. push localStorage keys that are NOT recovery keys
    fak2lak.push(...accountKeys.filter((ak) => !recoveryKeysED.includes(ak.public_key)).map((ak) => toPK(ak.public_key)))
    // these are the keys we need to convert to limited access keys
    // 5. get the server public key for wallet accountId (confirmOnlyKey)
    const getAccessKey = await wallet.postSignedJson('/2fa/getAccessKey', {
        accountId
    })
    if (!getAccessKey || !getAccessKey.success || !getAccessKey.publicKey) {
        console.log('error getting publicKey from contract-helper')
        return
    }
    const confirmOnlyKey = toPK(getAccessKey.publicKey)
    const newArgs = new Uint8Array(new TextEncoder().encode(JSON.stringify({ 'num_confirmations': 2 })));
    const actions = [
        // delete FAKs and add them as LAKs
        ...fak2lak.map((pk) => nearApiJs.transactions.deleteKey(pk)),
        ...fak2lak.map((pk) => nearApiJs.transactions.addKey(pk, nearApiJs.transactions.functionCallAccessKey(accountId, METHOD_NAMES_LAK, null))),
        // confirmOnlyKey
        nearApiJs.transactions.addKey(confirmOnlyKey, nearApiJs.transactions.functionCallAccessKey(accountId, METHOD_NAMES_CONFIRM, null)),
        // deploy and initialize contract
        nearApiJs.transactions.deployContract(contractBytes),
        nearApiJs.transactions.functionCall('new', newArgs, 10000000000000, '0'),
    ]
    console.log('deploying multisig contract')
    return await account.signAndSendTransaction(accountId, actions);
}