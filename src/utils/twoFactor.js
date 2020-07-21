import * as nearApiJs from 'near-api-js'
import { store } from '..'
import { promptTwoFactor } from '../actions/account'
import { METHOD_NAMES_LAK, METHOD_NAMES_CONFIRM, ACCESS_KEY_FUNDING_AMOUNT, splitPK, toPK } from './wallet'
/********************************
Helpers
********************************/
const getNextRequestId = async (contract) => {
    return contract.get_request_nonce().catch((e) => { console.log(e) })
}
const addRequestAndConfirm = async (contract, request) => {
    return contract.add_request_and_confirm({ request }).catch((e) => console.log(e))
}
const getContract = (account) => {
    // multisig account
    return new nearApiJs.Contract(account, account.accountId, {
        viewMethods: ['get_request_nonce'],
        changeMethods: METHOD_NAMES_LAK,
        sender: account.accountId
    });
}
/********************************
Exports
********************************/
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
        // we know the requestId of what we want to confirm so pop the modal now and wait on that
        return new Promise((resolve) => {
            store.dispatch(promptTwoFactor((verified) => {
                if (verified) {
                    wallet.tempTwoFactorAccount = null
                }
                resolve(verified)
            }))
        })
    } else {
        // wait for sever response to reture
        return await serverResponse
    }
}
export const twoFactorRequest = async (wallet, account, request) => {
    // override account if we're recovering with 2fa
    if (wallet.tempTwoFactorAccount) account = wallet.tempTwoFactorAccount
    const { accountId } = account
    console.log('makeTwoFactorRequest', accountId, request, account)
    const contract = getContract(account)
    const request_id = await getNextRequestId(contract)
    await addRequestAndConfirm(contract, request)
    const request_id_after = await getNextRequestId(contract)
    if (request_id_after > request_id) {
        // request was successfully added, send verification code to 2fa method
        const data = { request_id, request }
        const method = await wallet.get2faMethod()
        return await sendTwoFactorRequest(wallet, accountId, method, request_id, data)
    }
}
export const twoFactorAddKey = (wallet, account, contractId, publicKey, fullAccess = false) => {
    const {accountId} = account
    // default method names will be limited access key multisig contract methods
    let allowance = ACCESS_KEY_FUNDING_AMOUNT
    let method_names = METHOD_NAMES_LAK
    if (contractId !== accountId) {
        fullAccess = false
        method_names = ['']
    } else {
        allowance = '0'
    }
    const request = {
        // always adding keys to our account
        receiver_id: account.accountId,
        actions: [{
            type: 'AddKey',
            public_key: splitPK(publicKey),
            // a full access key has no permission
            ...(!fullAccess ? {
                permission: {
                    // not always adding a key FOR our account
                    receiver_id: contractId,
                    allowance,
                    method_names
                }
            } : null)
        }]
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