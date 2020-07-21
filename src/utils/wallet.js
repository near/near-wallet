import * as nearApiJs from 'near-api-js'
import { KeyPair } from 'near-api-js'
import sendJson from 'fetch-send-json'
import { parseSeedPhrase } from 'near-seed-phrase'
import { PublicKey } from 'near-api-js/lib/utils'
import { KeyType } from 'near-api-js/lib/utils/key_pair'
import { store } from '..'
import { getAccessKeys, promptTwoFactor } from '../actions/account'
import { generateSeedPhrase } from 'near-seed-phrase';
import { getAccountIds } from './explorer-api'
import { WalletError } from './walletError'
import { setAccountConfirmed, getAccountConfirmed, removeAccountConfirmed} from './localStorage'
import BN from 'bn.js'

export const WALLET_CREATE_NEW_ACCOUNT_URL = 'create'
export const WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS = ['create', 'set-recovery', 'setup-seed-phrase', 'recover-account', 'recover-seed-phrase', 'sign-in-ledger']
export const WALLET_LOGIN_URL = 'login'
export const WALLET_SIGN_URL = 'sign'
export const ACCOUNT_HELPER_URL = process.env.REACT_APP_ACCOUNT_HELPER_URL || 'https://near-contract-helper-2fa.onrender.com'
export const EXPLORER_URL = process.env.EXPLORER_URL || 'https://explorer.testnet.near.org';
export const IS_MAINNET = process.env.REACT_APP_IS_MAINNET === 'true' || process.env.REACT_APP_IS_MAINNET === 'yes'
export const DISABLE_SEND_MONEY = process.env.DISABLE_SEND_MONEY === 'true' || process.env.DISABLE_SEND_MONEY === 'yes'
export const ACCOUNT_ID_SUFFIX = process.env.REACT_APP_ACCOUNT_ID_SUFFIX || 'testnet'
export const LOCKUP_ACCOUNT_ID_SUFFIX = process.env.LOCKUP_ACCOUNT_ID_SUFFIX || 'lockup'

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID || 'default'
const CONTRACT_CREATE_ACCOUNT_URL = `${ACCOUNT_HELPER_URL}/account`
export const NODE_URL = process.env.REACT_APP_NODE_URL || 'https://rpc.nearprotocol.com'

const KEY_UNIQUE_PREFIX = '_4:'
const KEY_WALLET_ACCOUNTS = KEY_UNIQUE_PREFIX + 'wallet:accounts_v2'
const KEY_ACTIVE_ACCOUNT_ID = KEY_UNIQUE_PREFIX + 'wallet:active_account_id_v2'
const ACCESS_KEY_FUNDING_AMOUNT = process.env.REACT_APP_ACCESS_KEY_FUNDING_AMOUNT || nearApiJs.utils.format.parseNearAmount('0.01')
const ACCOUNT_ID_REGEX = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/
const ACCOUNT_NO_CODE_HASH = '11111111111111111111111111111111'
const METHOD_NAMES_LAK = ["add_request", "add_request_and_confirm", "delete_request", "confirm"]
const METHOD_NAMES_CONFIRM = ["confirm"]

console.log('ACCESS_KEY_FUNDING_AMOUNT', ACCESS_KEY_FUNDING_AMOUNT)

export const keyAccountConfirmed = (accountId) => `wallet.account:${accountId}:${NETWORK_ID}:confirmed`

const WALLET_METADATA_METHOD = '__wallet__metadata'

export const ACCOUNT_CHECK_TIMEOUT = 500
export const TRANSACTIONS_REFRESH_INTERVAL = 10000

/********************************
Linkdrop data
********************************/
export const getLinkdropData = () => {
    return JSON.parse(localStorage.getItem(`__linkdropData`) || `{}`)
}
export const setLinkdropData = (data) => {
    return localStorage.setItem(`__linkdropData`, JSON.stringify(data))
}
/********************************
Managing 2fa requests
********************************/
let tempTwoFactorAccount = null
export const getRequest = () => {
    return JSON.parse(localStorage.getItem(`__multisigRequest`) || `{}`)
}
export const setRequest = (data) => {
    localStorage.setItem(`__multisigRequest`, JSON.stringify(data))
}
// helpers
const splitPK = (pk) => {
    if (typeof pk !== 'string') {
        pk = pk.toString()
    }
    return pk.replace('ed25519:', '')
}
const toPK = (pk) => nearApiJs.utils.PublicKey.from(pk)

export const setTempAccount = (accountId) => {
    localStorage.setItem(`__tempAccount`, JSON.stringify({
        accountId, // keyPair: KeyPair.fromRandom('ed25519')
    }))
}
export const delTempAccount = () => {
    localStorage.removeItem(`__tempAccount`)
}
export const getTempAccount = () => {
    return JSON.parse(localStorage.getItem(`__tempAccount`) || '{}')
}

// const test = getTempAccount()
// console.log('keyPair', test.keyPair)

async function setKeyMeta(publicKey, meta) {
    localStorage.setItem(`keyMeta:${publicKey}`, JSON.stringify(meta))
}

async function getKeyMeta(publicKey) {
    try {
        return JSON.parse(localStorage.getItem(`keyMeta:${publicKey}`)) || {};
    } catch (e) {
        return {};
    }
}

class Wallet {
    constructor() {
        this.keyStore = new nearApiJs.keyStores.BrowserLocalStorageKeyStore(window.localStorage, 'nearlib:keystore:')
        this.inMemorySigner = new nearApiJs.InMemorySigner(this.keyStore)

        const inMemorySigner = this.inMemorySigner
        const wallet = this
        this.signer = {
            async getPublicKey(accountId, networkId) {
                return (await wallet.getLedgerKey(accountId)) || (await inMemorySigner.getPublicKey(accountId, networkId))
            },
            async signMessage(message, accountId, networkId) {
                if (await wallet.getLedgerKey(accountId)) {
                    const { createLedgerU2FClient } = await import('./ledger.js')
                    const client = await createLedgerU2FClient()
                    const signature = await client.sign(message)
                    const publicKey = await this.getPublicKey(accountId, networkId)
                    return {
                        signature,
                        publicKey
                    }
                }

                return inMemorySigner.signMessage(message, accountId, networkId)
            }
        }
        this.connection = nearApiJs.Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
            signer: this.signer
        })
        this.accounts = JSON.parse(
            localStorage.getItem(KEY_WALLET_ACCOUNTS) || '{}'
        )
        this.accountId = localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID) || ''
    }

    async get2faMethod(account) {
        return (await this.getRecoveryMethods(account)).data.filter((m) => m.kind.indexOf('2fa-') > -1).map(({ kind, detail, createdAt }) => ({ kind, detail, createdAt }))[0]
    }

    async getLocalAccessKey(accountId, accessKeys) {
        const localPublicKey = await this.inMemorySigner.getPublicKey(accountId, NETWORK_ID)
        return localPublicKey && accessKeys.find(({ public_key }) => public_key === localPublicKey.toString())
    }

    async getLedgerKey(accountId) {
        // TODO: Cache keys / record Ledger status for account more efficiently
        const accessKeys = await this.getAccessKeys(accountId)
        if (accessKeys) {
            const localKey = await this.getLocalAccessKey(accountId, accessKeys)
            const ledgerKey = accessKeys.find(accessKey => accessKey.meta.type === 'ledger')
            if (ledgerKey && (!localKey || localKey.permission !== 'FullAccess')) {
                return PublicKey.from(ledgerKey.public_key)
            }
        }
        return null
    }

    save() {
        localStorage.setItem(KEY_ACTIVE_ACCOUNT_ID, this.accountId)
        localStorage.setItem(KEY_WALLET_ACCOUNTS, JSON.stringify(this.accounts))
    }

    getAccountId() {
        const tempAccount = getTempAccount()
        // temp account was set during create account
        if (tempAccount && tempAccount.accountId) {
            return tempAccount.accountId
        } else {
            return this.accountId
        }
    }

    selectAccount(accountId) {
        if (!(accountId in this.accounts)) {
            return false
        }
        this.accountId = accountId
        this.save()
    }
    
    isLegitAccountId(accountId) {
        return ACCOUNT_ID_REGEX.test(accountId)
    }
    
    async sendMoney(receiverId, amount) {
        const { accountId } = this
        const { account, has2fa } = await this.getAccountAndState(accountId)
        if (has2fa) {
            const request = {
                receiver_id: receiverId,
                actions: [{ type: 'Transfer', amount }]
            }
            await this.makeTwoFactorRequest(account, request)
        } else {
            await account.sendMoney(receiverId, amount)
        }
    }
    /********************************
    Multisig Requests
    ********************************/
    async makeTwoFactorRequest(account, request) {
        // override account if we're recovering with 2fa
        if (tempTwoFactorAccount) account = tempTwoFactorAccount
        const { accountId } = account
        console.log('makeTwoFactorRequest', accountId, request, account)
        const contract = this.getContract(account)
        const request_id = await this.getNextRequestId(contract)
        await this.addRequestAndConfirm(contract, request)
        const request_id_after = await this.getNextRequestId(contract)
        if (request_id_after > request_id) {
            // request was successfully added, send verification code to 2fa method
            const data = { request_id, request }
            const method = await this.get2faMethod()
            return await this.sendTwoFactor(accountId, method, request_id, data)
        }
    }
    /********************************
    Multisig contract methods (call getContract first)
    ********************************/
    async getNextRequestId(contract) {
        return contract.get_request_nonce().catch((e) => { console.log(e) })
    }
    async addRequestAndConfirm(contract, request) {
        return contract.add_request_and_confirm({ request }).catch((e) => console.log(e))
    }
    /********************************
    Sync function gets multisig contract instance for the current account
    ********************************/
    getContract(account) {
        // multisig account
        return new nearApiJs.Contract(account, account.accountId, {
            viewMethods: ['get_request_nonce'],
            changeMethods: ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm'],
            sender: account.accountId
        });
    }
    /********************************
    End of Multisig Methods
    ********************************/

    isEmpty() {
        return !this.accounts || !Object.keys(this.accounts).length
    }

    async refreshAccount() {
        try {
            const account = await this.loadAccount()
            setAccountConfirmed(this.accountId, true)
            return account
        } catch (error) {
            console.error('Error loading account:', error)

            if (error.toString().indexOf('does not exist while viewing') !== -1) {
                const accountId = this.accountId
                const accountIdNotConfirmed = !getAccountConfirmed(accountId)
                
                this.clearAccountState()
                const nextAccountId = Object.keys(this.accounts).find((account) => (
                    getAccountConfirmed(account)
                )) || Object.keys(this.accounts)[0]
                this.selectAccount(nextAccountId)

                return {
                    resetAccount: {
                        reset: true,
                        preventClear: accountIdNotConfirmed,
                        accountIdNotConfirmed: accountIdNotConfirmed ? accountId : ''
                    },
                    globalAlertPreventClear: accountIdNotConfirmed || this.isEmpty(),
                    globalAlert: {
                        success: false,
                        messageCode: 'account.create.errorAccountNotExist'
                    },
                    ...(!this.isEmpty() && !accountIdNotConfirmed && await this.loadAccount())
                }
            }

            throw error
        }
    }

    async loadAccount() {
        const tempAccount = getTempAccount()
        // temp account was set during create account
        if (tempAccount && tempAccount.accountId) {
            return {
                temp: true,
                balance: 0,
                accountId: tempAccount.accountId,
            }
        }
        if (this.isEmpty()) {
            throw new Error('No account.')
        }
        return {
            ...await this.getAccount(this.accountId).state(),
            balance: await this.getBalance(),
            accountId: this.accountId,
            accounts: this.accounts
        }
    }

    // TODO: Figure out whether wallet should work with any account or current one. Maybe make wallet account specific and switch whole Wallet?
    async getAccessKeys(accountId) {
        accountId = accountId || this.accountId
        if (!accountId) return null

        const accessKeys = await this.getAccount(accountId).getAccessKeys()
        return Promise.all(accessKeys.map(async (accessKey) => ({
            ...accessKey,
            meta: await getKeyMeta(accessKey.public_key)
        })))
    }

    async removeAccessKey(publicKey) {
        const { account, has2fa } = await this.getAccountAndState()
        if (has2fa) {
            const request = {
                receiver_id: this.accountId,
                actions: [{ type: 'DeleteKey', public_key: splitPK(publicKey) }]
            }
            return await this.makeTwoFactorRequest(account, request)
        } else {
            return await this.getAccount(this.accountId).deleteKey(publicKey)
        }
    }

    async removeNonLedgerAccessKeys() {
        const accessKeys =  await this.getAccessKeys()
        const localAccessKey = await this.getLocalAccessKey(this.accountId, accessKeys)
        const account = this.getAccount(this.accountId)
        const keysToRemove = accessKeys.filter(({
            public_key,
            access_key: { permission },
            meta: { type }
        }) => permission === 'FullAccess' && type !== 'ledger' && !(localAccessKey && public_key === localAccessKey.public_key))

        const WALLET_METADATA_METHOD = '__wallet__metadata'
        let newLocalKeyPair
        if (!localAccessKey || (!localAccessKey.access_key.permission.FunctionCall ||
            !localAccessKey.access_key.permission.FunctionCall.method_names.includes(WALLET_METADATA_METHOD))) {
            // NOTE: This key isn't used to call actual contract method, just used to verify connection with account in private DB
            newLocalKeyPair = KeyPair.fromRandom('ed25519')
            await account.addKey(newLocalKeyPair.getPublicKey(), this.accountId, WALLET_METADATA_METHOD, '0')
        }

        for (const { public_key } of keysToRemove) {
            await account.deleteKey(public_key)
        }

        if (newLocalKeyPair) {
            if (localAccessKey) {
                await account.deleteKey(localAccessKey.public_key)
            }
            await this.keyStore.setKey(NETWORK_ID, this.accountId, newLocalKeyPair)
        }

        const { data: recoveryMethods } = await this.getRecoveryMethods();
        for (const recoveryMethod of recoveryMethods) {
            this.deleteRecoveryMethod(recoveryMethod)
        }
    }

    async checkAccountAvailable(accountId) {
        if (!this.isLegitAccountId(accountId)) {
            throw new Error('Invalid username.')
        }
        if (accountId !== this.accountId) {
            return await this.getAccount(accountId).state()
        } else {
            throw new Error('You are logged into account ' + accountId + ' .')
        }
    }

    async checkNewAccount(accountId) {
        if (!this.isLegitAccountId(accountId)) {
            throw new Error('Invalid username.')
        }
        if (accountId.match(/.*[.@].*/)) {
            if (!accountId.endsWith(`.${ACCOUNT_ID_SUFFIX}`)) {
                throw new Error('Characters `.` and `@` have special meaning and cannot be used as part of normal account name.');
            }
        }
        if (accountId in this.accounts) {
            throw new Error('Account ' + accountId + ' already exists.')
        }
        let remoteAccount = null
        try {
            remoteAccount = await this.getAccount(accountId).state()
        } catch (e) {
            return true
        }
        if (!!remoteAccount) {
            throw new Error('Account ' + accountId + ' already exists.')
        }
    }

    /********************************
    Check account was created before saving 10 retries, 1s each
    ********************************/
    async checkAccountAndSave(accountId, keyPair) {
        return new Promise((resolve, reject) => {
            let attempts = 0
            const retries = 10
            const check = async () => {
                attempts++
                console.log(`attempt: ${attempts}, checking for account: ${accountId}`)
                if (attempts >= retries) {
                    reject('account cannot be found')
                    return
                }
                try {
                    await this.getAccount(accountId).state()
                    resolve(await this.saveAndSelectAccount(accountId, keyPair));
                } catch (e) {
                    setTimeout(check, 1000)
                }
            }
            check()
        })
    }

    async createNewAccount(accountId, fundingContract, fundingKey) {
        this.checkNewAccount(accountId);
        const keyPair = KeyPair.fromRandom('ed25519');

        if (!fundingKey) {
            const linkdropData = getLinkdropData()
            if (linkdropData && linkdropData.fundingKey) {
                let {} = { fundingContract, fundingKey } = linkdropData
            }
        }

        try {
            if (fundingContract && fundingKey) {
                await this.createNewAccountLinkdrop(accountId, fundingContract, fundingKey, keyPair)
                await this.keyStore.removeKey(NETWORK_ID, fundingContract)
            } else {
                await sendJson('POST', CONTRACT_CREATE_ACCOUNT_URL, {
                    newAccountId: accountId,
                    newAccountPublicKey: keyPair.publicKey.toString()
                })
            }
            await this.saveAndSelectAccount(accountId, keyPair);
        } catch(e) {
            if (e.type === 'TimeoutError' || e.type === 'RetriesExceeded' || e instanceof TypeError) {
                await this.saveAndSelectAccount(accountId, keyPair)
            }
            else {
                throw e
            }
        }
    }

    async createNewAccountLinkdrop(accountId, fundingContract, fundingKey, keyPair) {

        console.log(fundingContract, fundingKey)
        
        const account = this.getAccount(fundingContract);
        await this.keyStore.setKey(
            NETWORK_ID, fundingContract,
            KeyPair.fromString(fundingKey)
        )
        const contract = new nearApiJs.Contract(account, fundingContract, {
            changeMethods: ['create_account_and_claim', 'claim'],
            sender: fundingContract
        });
        const publicKey = keyPair.publicKey.toString().replace('ed25519:', '');
        await contract.create_account_and_claim({
            new_account_id: accountId,
            new_public_key: publicKey
        });
    }

    async saveAndSelectAccount(accountId, keyPair) {
        await this.saveAccount(accountId, keyPair)
        this.accountId = accountId
        this.save()
        setAccountConfirmed(this.accountId, false)
    }

    async saveAccount(accountId, keyPair) {
        if (keyPair) {
            await this.keyStore.setKey(NETWORK_ID, accountId, keyPair)
        }
        this.accounts[accountId] = true
    }

    async addAccessKey(accountId, contractId, publicKey, fullAccess = false) {
        const { account, has2fa } = await this.getAccountAndState()
        let allowance = ACCESS_KEY_FUNDING_AMOUNT
        if (has2fa) {
            // default method names will be limited access key multisig contract methods
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
            return await this.makeTwoFactorRequest(account, request)
        } else {
            try {
                return await this.getAccount(accountId).addKey(
                    publicKey,
                    contractId,
                    '', // methodName
                    ACCESS_KEY_FUNDING_AMOUNT
                )
            } catch (e) {
                if (e.type === 'AddKeyAlreadyExists') {
                    return true;
                }
                throw e;
            }
        }
    }

    async addLedgerAccessKey(accountId) {
        const publicKey = await this.getLedgerPublicKey()
        await setKeyMeta(publicKey, { type: 'ledger' })
        return await this.getAccount(accountId).addKey(publicKey)
    }

    async addWalletMetadataAccessKeyIfNeeded(accountId, localAccessKey) {
        if (!localAccessKey || (!localAccessKey.access_key.permission.FunctionCall ||
                !localAccessKey.access_key.permission.FunctionCall.method_names.includes(WALLET_METADATA_METHOD))) {
            // NOTE: This key isn't used to call actual contract method, just used to verify connection with account in private DB
            const newLocalKeyPair = KeyPair.fromRandom('ed25519')
            const account = this.getAccount(accountId)
            await account.addKey(newLocalKeyPair.getPublicKey(), accountId, WALLET_METADATA_METHOD, '0')
            return newLocalKeyPair
        }

        return null
    }

    async signInWithLedger() {
        const publicKey = await this.getLedgerPublicKey()
        await setKeyMeta(publicKey, { type: 'ledger' })
        const accountIds = await getAccountIds(publicKey.toString())

        for (let i = 0; i < accountIds.length; i++) {
            const accountId = accountIds[i]
            const accessKeys =  await this.getAccessKeys(accountId)
            const localAccessKey = await this.getLocalAccessKey(accountId, accessKeys)
            let newKeyPair = await this.addWalletMetadataAccessKeyIfNeeded(accountId, localAccessKey)

            if (i === accountIds.length - 1) {
                await this.saveAndSelectAccount(accountId, newKeyPair)
            } else {
                await this.saveAccount(accountId, newKeyPair)
            }
        }

        return {
            numberOfAccounts: accountIds.length,
            accountList: accountIds.flatMap((accountId) => accountId).join(', ')
        }
    }

    async getLedgerPublicKey() {
        const { createLedgerU2FClient } = await import('./ledger.js')
        const client = await createLedgerU2FClient()
        const rawPublicKey = await client.getPublicKey()
        return new PublicKey({ keyType: KeyType.ED25519, data: rawPublicKey })
    }

    async getAvailableKeys() {
        const availableKeys = [(await this.keyStore.getKey(NETWORK_ID, this.accountId)).publicKey]
        const ledgerKey = await this.getLedgerKey(this.accountId)
        if (ledgerKey) {
            availableKeys.push(ledgerKey.toString())
        }
        return availableKeys
    }

    clearAccountState() {
        delete this.accounts[this.accountId]
        removeAccountConfirmed(this.accountId)
        this.accountId = ''
        this.save()
    }

    getAccount(accountId) {
        return new nearApiJs.Account(this.connection, accountId)
    }

    async getAccountAndState(accountId) {
        const account = this.getAccount(accountId)
        account.accountId = this.accountId
        const state = await account.state()
        const has2fa = state.code_hash !== ACCOUNT_NO_CODE_HASH
        return { account, state, has2fa }
    }

    async getBalance(accountId) {
        accountId = accountId || this.accountId

        const account = this.getAccount(accountId)
        const balance = await account.getAccountBalance()

        // TODO: Should lockup contract balance be retrieved separately only when needed?
        const lockupAccountId = accountId + '.' + LOCKUP_ACCOUNT_ID_SUFFIX
        try {
            // TODO: Makes sense for a lockup contract to return whole state as JSON instead of method per property
            const [
                ownersBalance,
                liquidOwnersBalance,
                lockedAmount,
                unvestedAmount
            ] = await Promise.all([
                'get_owners_balance',
                'get_liquid_owners_balance',
                'get_locked_amount',
                'get_unvested_amount'
            ].map(methodName => account.viewFunction(lockupAccountId, methodName)))

            return {
                ...balance,
                ownersBalance,
                liquidOwnersBalance,
                lockedAmount,
                unvestedAmount,
                total: new BN(balance.total).add(new BN(lockedAmount)).add(new BN(ownersBalance)).toString()
            }
        } catch (error) {
            if (error.message.match(/Account ".+" doesn't exist/)) {
                return balance
            }
            throw error
        }
    }

    async signatureFor(account) {
        const { accountId } = account
        const blockNumber = String((await account.connection.provider.status()).sync_info.latest_block_height);
        const signer = account.inMemorySigner || account.connection.signer
        const signed = await signer.signMessage(Buffer.from(blockNumber), accountId, NETWORK_ID);
        const blockNumberSignature = Buffer.from(signed.signature).toString('base64');
        return { blockNumber, blockNumberSignature };
    }

    async postSignedJson(path, options) {
        // if there's a tempTwoFactorAccount (recovery with 2fa) use that vs. this
        console.log('tempTwoFactorAccount', tempTwoFactorAccount)
        return await sendJson('POST', ACCOUNT_HELPER_URL + path, {
            ...options,
            ...(await this.signatureFor(tempTwoFactorAccount ? tempTwoFactorAccount : this))
        });
    }

    async initializeRecoveryMethod(accountId, method) {
        const tempAccount = getTempAccount()
        if (tempAccount && tempAccount.accountId) {
            return await sendJson('POST', ACCOUNT_HELPER_URL + '/account/initializeRecoveryMethodForTempAccount', {
                accountId,
                method,
            });
        } else {
            return await this.postSignedJson('/account/initializeRecoveryMethod', {
                accountId,
                method
            });
        }
    }

    async validateSecurityCode(accountId, method, securityCode) {
        const tempAccount = getTempAccount()
        if (tempAccount && tempAccount.accountId) {
            return await sendJson('POST', ACCOUNT_HELPER_URL + '/account/validateSecurityCodeForTempAccount', {
                accountId,
                method,
                securityCode
            });
        } else {
            return await this.postSignedJson('/account/validateSecurityCode', {
                accountId,
                method,
                securityCode
            });
        }
    }

    async initTwoFactor(accountId, method) {
        // clear any previous requests in localStorage (for verifyTwoFactor)
        setRequest({})
        return await this.postSignedJson('/2fa/init', {
            accountId,
            method
        });
    }

    async reInitTwoFactor(accountId, method) {
        // clear any previous requests in localStorage (for verifyTwoFactor)
        setRequest({})
        return this.sendTwoFactor(accountId, method)
    }

    async sendTwoFactor(accountId, method, requestId = -1, data = {}) {
        if (!accountId) accountId = this.accountId
        if (!method) method = await this.get2faMethod()
        // add request to local storage
        setRequest({ accountId, requestId, data })

        console.log(accountId, requestId, data)
        console.log('tempTwoFactorAccount', tempTwoFactorAccount)

        const serverResponse = this.postSignedJson('/2fa/send', {
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
                        tempTwoFactorAccount = null
                    }
                    resolve(verified)
                }))
            })
        } else {
            // wait for sever response to reture
            return await serverResponse
        }
    }

    async resendTwoFactor(accountId, method) {
        if (!accountId) accountId = this.accountId
        if (!method) method = await this.get2faMethod()
        const requestData = getRequest()
        let { requestId, data } = requestData
        if (!requestId && requestId !== 0) {
            console.log('no pending multisig requestId found, assuming account setup')
            requestId = -1
        }
        return this.sendTwoFactor(accountId, method, requestId, data)
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
        if (!accountId) accountId = requestData.accountId || this.accountId
        if (!accountId) {
            console.error('no pending multisig accountId found')
            return
        }
        return await this.postSignedJson('/2fa/verify', {
            accountId,
            securityCode,
            requestId
        });
    }

    async getRecoveryMethods(account) {
        const accountId = account ? account.accountId : this.accountId
        return {
            accountId,
            data: await this.postSignedJson('/account/recoveryMethods', { accountId }, account)
        }
    }

    /********************************
    Deploys 2/3 multisig contract with keys from contract-helper and localStorage
    @todo check account has enough near to actually do this

    const tempAccount = getTempAccount()
    // temp account was set during create account
    if (tempAccount && tempAccount.accountId) {
        // console.log('temp account')
        return {
            temp: true,
            balance: 0,
            accountId: tempAccount.accountId,
        }
    }
    // else load account normally from api
    ********************************/
    async deployMultisig() {
        const accountData = await this.loadAccount()
        // get multisig contract to deploy
        const contractBytes = new Uint8Array(await fetch('/multisig.wasm').then((res) => res.arrayBuffer()))
        console.log('contractBytes', contractBytes)
        // get account
        const { accountId } = accountData
        const account = this.getAccount(accountId)
        console.log(account)
        /********************************
        KMS
        ********************************/
        // 1. get localstorage keys
        const accountKeys = await account.getAccessKeys();
        console.log('accountKeys', accountKeys)
        // 2. get recovery method keys
        const recoveryMethods = await this.getRecoveryMethods()
        console.log('recoveryMethods', recoveryMethods)
        const recoveryKeysED = recoveryMethods.data.map((rm) => rm.publicKey)
        // 3. get recovery keys that are NOT seed phrases && NOT null publicKey
        const fak2lak = recoveryMethods.data.filter(({ kind, publicKey }) => kind !== 'phrase' && publicKey !== null).map((rm) => toPK(rm.publicKey))
        // 4. push localStorage keys that are NOT recovery keys
        fak2lak.push(...accountKeys.filter((ak) => !recoveryKeysED.includes(ak.public_key)).map((ak) => toPK(ak.public_key)))
        // these are the keys we need to convert to limited access keys
        console.log('fak2lak', fak2lak)
        // 5. get the server public key for this accountId (confirmOnlyKey)
        const getAccessKey = await this.postSignedJson('/2fa/getAccessKey', {
            accountId
        })
        if (!getAccessKey || !getAccessKey.success || !getAccessKey.publicKey) {
            console.log('error getting publicKey from contract-helper')
            return
        }
        const confirmOnlyKey = toPK(getAccessKey.publicKey)
        console.log('confirmOnlyKey', confirmOnlyKey)

        // const confirm = window.confirm('deploy contract?')
        // if (!confirm) return
        /********************************
        Key updates, multisig deployment and initialization 
        ********************************/
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
        console.log('actions', actions)
        return await account.signAndSendTransaction(accountId, actions);
    }

    async createNewAccountForTempAccount(accountId, fundingContract, fundingKey) {
        // create account because recovery is validated
        if (!accountId) {
            // updated to get tempAccount.accountId
            accountId = this.getAccountId()
        }
        await this.createNewAccount(accountId, fundingContract, fundingKey)
        const account = this.getAccount(accountId)
        console.log('account created', account)
        // remove the temp account, we now have a real account on chain
        delTempAccount()
        return account
    }

    async setupRecoveryMessage(accountId, method, securityCode, fundingContract, fundingKey) {
        // temp account was set during create account
        console.log('setupRecoveryMessage', accountId)
        let securityCodeResult = await this.validateSecurityCode(accountId, method, securityCode);
        if (!securityCodeResult || securityCodeResult.length === 0) {
            console.log('INVALID CODE', securityCodeResult)
            return
        }
        const tempAccount = getTempAccount()
        // if this is a tempAccount we'll create a new account now
        if (tempAccount && tempAccount.accountId) {
            // added method above, also used for seed recovery
            await this.createNewAccountForTempAccount(accountId, fundingContract, fundingKey)
        }
        // now send recovery seed phrase
        const { seedPhrase, publicKey } = generateSeedPhrase();
        const { account, has2fa } = await this.getAccountAndState(accountId)
        const accountKeys = await account.getAccessKeys();
        if (has2fa) {
            await this.addAccessKey(account.accountId, account.accountId, splitPK(publicKey))
            // const request = {
            //     receiver_id: account.accountId,
            //     actions: [{ type: 'AddKey', public_key: splitPK(publicKey) }]
            // }
            // await this.makeTwoFactorRequest(account, request)
        } else {
            if (!accountKeys.some(it => it.public_key.endsWith(publicKey))) {
                await account.addKey(publicKey);
            }
        }
        /********************************
        Can we send signed JSON here? Should we?
        @warning is this a vulnerability?
        this.postSignedJson(ACCOUNT_HELPER_URL
        ********************************/
        return sendJson('POST', `${ACCOUNT_HELPER_URL}/account/sendRecoveryMessage`, {
            accountId,
            method,
            seedPhrase
        });
    }

    async replaceAccessKey(oldKey, newKey) {
        const accountId = this.accountId;
        await this.getAccount(accountId).addKey(newKey)
        await this.removeAccessKey(oldKey)
    }

    async sendNewRecoveryLink(method) {
        const accountId = this.accountId;
        const { seedPhrase, publicKey } = generateSeedPhrase();

        await this.postSignedJson('/account/resendRecoveryLink', {
            accountId,
            method,
            seedPhrase,
            publicKey
        });
        await this.replaceAccessKey(method.publicKey, publicKey)
    }

    async deleteRecoveryMethod({ kind, publicKey }) {
        const res = await this.removeAccessKey(publicKey)
        console.log('deleteRecoveryMethod', res)
        await this.postSignedJson('/account/deleteRecoveryMethod', {
            accountId: this.accountId,
            kind,
            publicKey
        })
    }

    async recoverAccountSeedPhrase(seedPhrase, use2fa = false, accountId, fromSeedPhraseRecovery = false) {
        const { publicKey, secretKey } = parseSeedPhrase(seedPhrase)

        console.log('recovering account with publicKey', publicKey)

        const accountIds = await getAccountIds(publicKey)
        // if we don't find accountIds we can push one from the link (email/sms ONLY)
        if (accountId && !accountIds.includes(accountId)) {
            accountIds.push(accountId)
        }

        if (!accountIds.length) {
            // hopefully an unlikely scenario after we fix indexer
            const userProvidedAccountId = window.prompt('Cannot find Account Name. Please enter the name of the account to recover.')
            if (!userProvidedAccountId || !userProvidedAccountId.length) {
                throw new WalletError('Cannot find matching public key', 'account.recoverAccount.errorInvalidSeedPhrase', { publicKey })
            }
            accountIds.push(userProvidedAccountId)
            // if user provided seed phrase it's probably a LAK
            if (!fromSeedPhraseRecovery) {
                use2fa = true
            }
        }

        const tempKeyStore = new nearApiJs.keyStores.InMemoryKeyStore()

        const connection = nearApiJs.Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
            signer: new nearApiJs.InMemorySigner(tempKeyStore)
        })
        await Promise.all(accountIds.map(async (accountId, i) => {
            const account = new nearApiJs.Account(connection, accountId)
            account.accountId = accountId
            this.accountId = accountId
            // recovery keypair
            const keyPair = KeyPair.fromString(secretKey)
            await tempKeyStore.setKey(NETWORK_ID, accountId, keyPair)
            account.keyStore = tempKeyStore
            account.inMemorySigner = new nearApiJs.InMemorySigner(tempKeyStore)
            // this will replace the signer when we postSignedJson
            tempTwoFactorAccount = account
            // generate new keypair
            const newKeyPair = KeyPair.fromRandom('ed25519')
            // check if multisig deployed
            const state = await account.state()
            /********************************
            Cases: (1) multisig + LAK recovery, (2) multisig + FAK recovery with seed phrase, (3) no multisig
            ********************************/
            if (state.code_hash !== ACCOUNT_NO_CODE_HASH) {
                if (use2fa) {
                    await this.addAccessKey(accountId, accountId, splitPK(newKeyPair.publicKey))
                } else {
                    // (2) multisig + FAK recovery with seed phrase - add LAK directly
                    const actions = [
                        nearApiJs.transactions.addKey(newKeyPair.publicKey, nearApiJs.transactions.functionCallAccessKey(accountId, METHOD_NAMES_LAK, null))
                    ]
                    const result = await account.signAndSendTransaction(accountId, actions).catch((e) => {
                        console.trace(e)
                    })
                    console.log(result)
                }
            } else {
                // (3) no multisig is deployed - add FAK directly
                await account.addKey(newKeyPair.publicKey)
            }
            if (i === accountIds.length - 1) {
                await this.saveAndSelectAccount(accountId, newKeyPair)
            } else {
                await this.saveAccount(accountId, newKeyPair)
            }
        }))

        return {
            numberOfAccounts: accountIds.length,
            accountList: accountIds.flatMap((accountId) => accountId.account_id).join(', '),
        }
    }

    async signAndSendTransactions(transactions, accountId) {
        for (let { receiverId, nonce, blockHash, actions } of transactions) {
            const [, signedTransaction] = await nearApiJs.transactions.signTransaction(receiverId, nonce, actions, blockHash, this.connection.signer, accountId, NETWORK_ID)
            await this.connection.provider.sendTransaction(signedTransaction)
        }
    }
}

export const wallet = new Wallet()
