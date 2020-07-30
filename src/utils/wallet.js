import * as nearApiJs from 'near-api-js'
import { KeyPair } from 'near-api-js'
import sendJson from 'fetch-send-json'
import { parseSeedPhrase } from 'near-seed-phrase'
import { PublicKey } from 'near-api-js/lib/utils'
import { KeyType } from 'near-api-js/lib/utils/key_pair'

import { generateSeedPhrase } from 'near-seed-phrase';
import { getAccountIds } from './explorer-api'
import { WalletError } from './walletError'
import { setAccountConfirmed, getAccountConfirmed, removeAccountConfirmed} from './localStorage'
import BN from 'bn.js'

import { 
    getRequest, setRequest, twoFactorRequest, sendTwoFactorRequest, 
    twoFactorAddKey, twoFactorRemoveKey, twoFactorDeploy,
    addKeyAction, deleteKeyAction,
    METHOD_NAMES_LAK,
} from './twoFactor'

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
// required by twoFactor.js
export const ACCESS_KEY_FUNDING_AMOUNT = process.env.REACT_APP_ACCESS_KEY_FUNDING_AMOUNT || nearApiJs.utils.format.parseNearAmount('0.01')

export const ENABLE_FULL_ACCESS_KEYS = process.env.ENABLE_FULL_ACCESS_KEYS === 'yes'

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID || 'default'
const CONTRACT_CREATE_ACCOUNT_URL = `${ACCOUNT_HELPER_URL}/account`
export const NODE_URL = process.env.REACT_APP_NODE_URL || 'https://rpc.nearprotocol.com'

const KEY_UNIQUE_PREFIX = '_4:'
const KEY_WALLET_ACCOUNTS = KEY_UNIQUE_PREFIX + 'wallet:accounts_v2'
const KEY_ACTIVE_ACCOUNT_ID = KEY_UNIQUE_PREFIX + 'wallet:active_account_id_v2'
const ACCOUNT_ID_REGEX = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/
const MULTISIG_CONTRACT_HASHES = process.env.MULTISIG_CONTRACT_HASHES || ['7GQStUCd8bmCK43bzD8PRh7sD2uyyeMJU5h8Rj3kXXJk'];

export const keyAccountConfirmed = (accountId) => `wallet.account:${accountId}:${NETWORK_ID}:confirmed`

const WALLET_METADATA_METHOD = '__wallet__metadata'

export const ACCOUNT_CHECK_TIMEOUT = 500
export const TRANSACTIONS_REFRESH_INTERVAL = 10000

export const convertPKForContract = (pk) => {
    if (typeof pk !== 'string') {
        pk = pk.toString()
    }
    return pk.replace('ed25519:', '')
}
export const toPK = (pk) => nearApiJs.utils.PublicKey.from(pk)

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

        window.test = async() => console.log(await this.postSignedJson('/2fa/verify', {
            accountId: this.accountId,
            securityCode:159363,
            requestId: 0
        }));
    }

    /********************************
    Two Factor
    @todo remove patching, update calls and actions
    ********************************/
    async deployMultisig() {
        return await twoFactorDeploy(this)
    }

    async sendTwoFactor(accountId, method, requestId = -1, data = {}) {
        return sendTwoFactorRequest(this, accountId, method, requestId, data)
    }

    async makeTwoFactorRequest(account, request) {
        return twoFactorRequest(this, account, request, await this.get2faMethod())
    }

    async get2faMethod() {
        const account = this.getAccount(this.accountId);
        const { has2fa } = await this.getAccountAndState();
        if (has2fa) {
            return (await this.getRecoveryMethods(account)).data.filter((m) => m.kind.indexOf('2fa-') > -1).map(({ kind, detail, createdAt }) => ({ kind, detail, createdAt }))[0]
        }
    }

    async getLocalAccessKey(accountId, accessKeys) {
        const localPublicKey = await this.inMemorySigner.getPublicKey(accountId, NETWORK_ID)
        return localPublicKey && accessKeys.find(({ public_key }) => public_key === localPublicKey.toString())
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
        return this.sendTwoFactor(this, accountId, method)
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
        return this.sendTwoFactor(this, accountId, method, requestId, data)
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
    /********************************
    End Two Factor
    ********************************/

    async getLedgerKey() {
        const accessKeys = await this.getAccessKeys(this.accountId)
        if (accessKeys) {
            const localKey = await this.getLocalAccessKey(this.accountId, accessKeys)
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
    
    isEmpty() {
        return !this.accounts || !Object.keys(this.accounts).length
    }

    async refreshAccount() {
        try {
            const account = await this.loadAccount()
            setAccountConfirmed(this.accountId, true)
            return account
        } catch (error) {
            console.log('Error loading account:', error.message)

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
            return await twoFactorRemoveKey(this, account, publicKey)
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
            try {
                await this.deleteRecoveryMethod(recoveryMethod)
            } catch(e) {
                throw(e)
            }
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

    async createNewAccount(accountId, fundingContract, fundingKey) {
        this.checkNewAccount(accountId);
        const keyPair = KeyPair.fromRandom('ed25519');

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
        if (!contractId) {
            contractId = account.accountId
        }
        if (has2fa) {
            return await twoFactorAddKey(this, account, publicKey, contractId, fullAccess)
        } else {
            try {
                if (fullAccess) {
                    return await this.getAccount(accountId).addKey(publicKey)
                } else {
                    return await this.getAccount(accountId).addKey(
                        publicKey,
                        contractId,
                        '', // methodName
                        ACCESS_KEY_FUNDING_AMOUNT
                    )
                }
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

    async disableLedger() {
        const account = this.getAccount(this.accountId)
        const keyPair = KeyPair.fromRandom('ed25519')
        await account.addKey(keyPair.publicKey)
        await this.keyStore.setKey(NETWORK_ID, this.accountId, keyPair)

        const publicKey = await this.getLedgerPublicKey()
        await this.removeAccessKey(publicKey)
        return await this.getAccessKeys(this.accountId)
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
        const accountIds = (
            (await Promise.all(
                (await getAccountIds(publicKey.toString()))
                    .map(async (accountId) => 
                        await this.getAccount(accountId).findAccessKey()
                            ? accountId
                            : null
                    )
                )
            )
            .filter(accountId => accountId)
        )

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
        const has2fa = MULTISIG_CONTRACT_HASHES.includes(state.code_hash)
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
        return await sendJson('POST', ACCOUNT_HELPER_URL + path, {
            ...options,
            ...(await this.signatureFor(this.tempTwoFactorAccount ? this.tempTwoFactorAccount : this))
        });
    }

    async initializeRecoveryMethod(accountId, method, isNew) {
        if (isNew) {
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

    async validateSecurityCode(accountId, method, securityCode, isNew) {
        if (isNew) {
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

    async getRecoveryMethods(account) {
        const accountId = account ? account.accountId : this.accountId
        return {
            accountId,
            data: await this.postSignedJson('/account/recoveryMethods', { accountId }, account)
        }
    }

    async setupRecoveryMessage(accountId, method, securityCode, isNew, fundingContract, fundingKey) {
        // validate the code
        let securityCodeResult = await this.validateSecurityCode(accountId, method, securityCode, isNew);
        if (!securityCodeResult || securityCodeResult.length === 0) {
            console.log('INVALID CODE', securityCodeResult)
            return
        }
        // create account if new
        if (isNew) {
            await this.createNewAccount(accountId, fundingContract, fundingKey)
        }
        // now finish recovery method setup
        const { seedPhrase, publicKey } = generateSeedPhrase();
        const { account, has2fa } = await this.getAccountAndState(accountId)
        const accountKeys = await account.getAccessKeys();
        if (has2fa) {
            await this.addAccessKey(account.accountId, account.accountId, convertPKForContract(publicKey))
        } else {
            if (!accountKeys.some(it => it.public_key.endsWith(publicKey))) {
                await account.addKey(publicKey);
            }
        }
        return sendJson('POST', `${ACCOUNT_HELPER_URL}/account/sendRecoveryMessage`, {
            accountId,
            method,
            seedPhrase
        });
    }

    async sendNewRecoveryLink(method) {
        const accountId = this.accountId;
        const { account, has2fa } = await this.getAccountAndState(accountId)
        const { seedPhrase, publicKey } = generateSeedPhrase()

        if (has2fa) {
            const request = {
                receiver_id: accountId,
                actions: [
                    addKeyAction(account, publicKey, accountId),
                    deleteKeyAction(method.publicKey)
                ]
            }
    
            await twoFactorRequest(this, account, request)
        } else {
            await account.addKey(publicKey)
            await this.removeAccessKey(method.publicKey)
        }

        return await this.postSignedJson('/account/resendRecoveryLink', {
            accountId,
            method,
            seedPhrase,
            publicKey
        });

    }

    async deleteRecoveryMethod({ kind, publicKey }) {
        const accessKeys =  await this.getAccessKeys()
        const pubKeys = accessKeys.map(key => key.public_key)

        if (pubKeys.includes(publicKey)) {
            await this.removeAccessKey(publicKey)
        }

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
            const keyPair = KeyPair.fromString(secretKey)
            await tempKeyStore.setKey(NETWORK_ID, accountId, keyPair)
            account.keyStore = tempKeyStore
            account.inMemorySigner = new nearApiJs.InMemorySigner(tempKeyStore)
            this.tempTwoFactorAccount = account
            const newKeyPair = KeyPair.fromRandom('ed25519')
            const state = await account.state()
            if (MULTISIG_CONTRACT_HASHES.includes(state.code_hash)) {
                if (use2fa) {
                    await this.addAccessKey(accountId, accountId, convertPKForContract(newKeyPair.publicKey))
                } else {
                    const actions = [
                        nearApiJs.transactions.addKey(newKeyPair.publicKey, nearApiJs.transactions.functionCallAccessKey(accountId, METHOD_NAMES_LAK, null))
                    ]
                    const result = await account.signAndSendTransaction(accountId, actions).catch((e) => {
                        console.trace(e)
                    })
                    console.log(result)
                }
            } else {
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
