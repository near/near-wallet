import * as nearApiJs from 'near-api-js'
import { KeyPair } from 'near-api-js'
import sendJson from 'fetch-send-json'
import { parseSeedPhrase } from 'near-seed-phrase'
import { PublicKey } from 'near-api-js/lib/utils'
import { KeyType } from 'near-api-js/lib/utils/key_pair'

import { getAccountIds } from './helper-api'
import { generateSeedPhrase } from 'near-seed-phrase';
import { WalletError } from './walletError'
import { setAccountConfirmed, getAccountConfirmed, removeAccountConfirmed} from './localStorage'
import BN from 'bn.js'

import { store } from '..'
import { setSignTransactionStatus, setLedgerTxSigned } from '../actions/account'

import { TwoFactor, METHOD_NAMES_LAK } from './twoFactor'

export const WALLET_CREATE_NEW_ACCOUNT_URL = 'create'
export const WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS = ['create', 'set-recovery', 'setup-seed-phrase', 'recover-account', 'recover-seed-phrase', 'sign-in-ledger']
export const WALLET_LOGIN_URL = 'login'
export const WALLET_SIGN_URL = 'sign'
export const ACCOUNT_HELPER_URL = process.env.REACT_APP_ACCOUNT_HELPER_URL || 'https://near-contract-helper.onrender.com'
export const EXPLORER_URL = process.env.EXPLORER_URL || 'https://explorer.testnet.near.org';
export const IS_MAINNET = process.env.REACT_APP_IS_MAINNET === 'true' || process.env.REACT_APP_IS_MAINNET === 'yes'
export const DISABLE_CREATE_ACCOUNT = process.env.DISABLE_CREATE_ACCOUNT === 'true' || process.env.DISABLE_CREATE_ACCOUNT === 'yes'
export const DISABLE_SEND_MONEY = process.env.DISABLE_SEND_MONEY === 'true' || process.env.DISABLE_SEND_MONEY === 'yes'
export const ACCOUNT_ID_SUFFIX = process.env.REACT_APP_ACCOUNT_ID_SUFFIX || 'testnet'
export const MULTISIG_MIN_AMOUNT = process.env.REACT_APP_MULTISIG_MIN_AMOUNT || '40'
export const LOCKUP_ACCOUNT_ID_SUFFIX = process.env.LOCKUP_ACCOUNT_ID_SUFFIX || 'lockup'
export const ACCESS_KEY_FUNDING_AMOUNT = process.env.REACT_APP_ACCESS_KEY_FUNDING_AMOUNT || nearApiJs.utils.format.parseNearAmount('0.01')
export const LINKDROP_GAS = process.env.LINKDROP_GAS || '100000000000000'
export const ENABLE_FULL_ACCESS_KEYS = process.env.ENABLE_FULL_ACCESS_KEYS === 'yes'

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID || 'default'
const CONTRACT_CREATE_ACCOUNT_URL = `${ACCOUNT_HELPER_URL}/account`
export const NODE_URL = process.env.REACT_APP_NODE_URL || 'https://rpc.nearprotocol.com'

const KEY_UNIQUE_PREFIX = '_4:'
const KEY_WALLET_ACCOUNTS = KEY_UNIQUE_PREFIX + 'wallet:accounts_v2'
const KEY_ACTIVE_ACCOUNT_ID = KEY_UNIQUE_PREFIX + 'wallet:active_account_id_v2'
const ACCOUNT_ID_REGEX = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/
const MULTISIG_CONTRACT_HASHES = process.env.MULTISIG_CONTRACT_HASHES || [
    // https://github.com/near/core-contracts/blob/fa3e2c6819ef790fdb1ec9eed6b4104cd13eb4b7/multisig/src/lib.rs
    '7GQStUCd8bmCK43bzD8PRh7sD2uyyeMJU5h8Rj3kXXJk',
    // https://github.com/near/core-contracts/blob/fb595e6ec09014d392e9874c2c5d6bbc910362c7/multisig/src/lib.rs
    'AEE3vt6S3pS2s7K6HXnZc46VyMyJcjygSMsaafFh67DF',
    // https://github.com/near/core-contracts/blob/636e7e43f1205f4d81431fad0be39c5cb65455f1/multisig/src/lib.rs
    '8DKTSceSbxVgh4ANXwqmRqGyPWCuZAR1fCqGPXUjD5nZ',
    // https://github.com/near/core-contracts/blob/f93c146d87a779a2063a30d2c1567701306fcae4/multisig/res/multisig.wasm
    '55E7imniT2uuYrECn17qJAk9fLcwQW4ftNSwmCJL5Di',
];

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
                    await store.dispatch(setLedgerTxSigned(true, accountId))
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

        this.twoFactor = new TwoFactor(this)
    }

    async getLocalAccessKey(accountId, accessKeys) {
        const localPublicKey = await this.inMemorySigner.getPublicKey(accountId, NETWORK_ID)
        return localPublicKey && accessKeys.find(({ public_key }) => public_key === localPublicKey.toString())
    }

    async getLedgerKey(accountId) {
        // TODO: All callers should specify accountId explicitly
        accountId = accountId || this.accountId
        // TODO: Refactor so that every account just stores a flag if it's on Ledger?

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
            await this.twoFactor.sendMoney(account, receiverId, amount)
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
        if (!this.isEmpty()) {
            const accessKeys = await this.getAccessKeys() || []
            const ledgerKey = accessKeys.find(key => key.meta.type === 'ledger')
            
            return {
                ...await this.getAccount(this.accountId).state(),
                balance: await this.getBalance(),
                accountId: this.accountId,
                accounts: this.accounts,
                authorizedApps: accessKeys.filter(it => (
                    it.access_key 
                    && it.access_key.permission.FunctionCall 
                    && it.access_key.permission.FunctionCall.receiver_id !== this.accountId
                )),
                fullAccessKeys: accessKeys.filter(it => (
                    it.access_key
                     && it.access_key.permission === 'FullAccess'
                )),
                ledger: {
                    ledgerKey,
                    hasLedger: !!ledgerKey
                }
            }
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
        const { account, has2fa } = await this.getAccountAndState(this.accountId)
        if (has2fa) {
            return await this.twoFactor.removeKey(account, publicKey)
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
        const methodsToRemove = recoveryMethods.filter(method => method.kind !== 'ledger')
        for (const recoveryMethod of methodsToRemove) {
            await this.deleteRecoveryMethod(recoveryMethod)
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

    async createNewAccount(accountId, fundingContract, fundingKey, publicKey, useLedger=false) {
        this.checkNewAccount(accountId);

        if (useLedger) {
            await setKeyMeta(publicKey, { type: 'ledger' })
        }

        if (fundingContract && fundingKey) {
            await this.createNewAccountLinkdrop(accountId, fundingContract, fundingKey, publicKey)
            await this.keyStore.removeKey(NETWORK_ID, fundingContract)
        } else {
            await sendJson('POST', CONTRACT_CREATE_ACCOUNT_URL, {
                newAccountId: accountId,
                newAccountPublicKey: publicKey.toString()
            })
        }

        if (useLedger) {
            await this.addLedgerAccountId(accountId)
        }

        await this.saveAndSelectAccount(accountId);

        if (useLedger) {
            await this.postSignedJson('/account/ledgerKeyAdded', { accountId, publicKey: publicKey.toString() })
        }
    }

    async checkNearDropBalance(fundingContract, fundingKey) {
        const account = this.getAccount(fundingContract)

        const contract = new nearApiJs.Contract(account, fundingContract, {
            viewMethods: ['get_key_balance'],
            sender: fundingContract
        });

        const key = KeyPair.fromString(fundingKey).publicKey.toString()

        return await contract.get_key_balance({ key })
    }

    async createNewAccountLinkdrop(accountId, fundingContract, fundingKey, publicKey) {
        const account = this.getAccount(fundingContract);
        await this.keyStore.setKey(NETWORK_ID, fundingContract, KeyPair.fromString(fundingKey))

        const contract = new nearApiJs.Contract(account, fundingContract, {
            changeMethods: ['create_account_and_claim', 'claim'],
            sender: fundingContract
        });

        await contract.create_account_and_claim({
            new_account_id: accountId,
            new_public_key: publicKey.toString().replace('ed25519:', '')
        }, LINKDROP_GAS);
    }

    async saveAndSelectAccount(accountId, keyPair) {
        await this.saveAccount(accountId, keyPair)
        this.accountId = accountId
        this.save()
        // TODO: What does setAccountConfirmed do?
        setAccountConfirmed(this.accountId, false)
    }

    async saveAccount(accountId, keyPair) {
        await this.setKey(accountId, keyPair)
        this.accounts[accountId] = true
    }

    async setKey(accountId, keyPair) {
        if (keyPair) {
            await this.keyStore.setKey(NETWORK_ID, accountId, keyPair)
        }
    }


    /********************************
    recovering a second account attempts to call this method with the currently logged in account and not the tempKeyStore 
    ********************************/
    // TODO: Why is fullAccess needed? Everything without contractId should be full access.
    async addAccessKey(accountId, contractId, publicKey, fullAccess = false) {
        const { account, has2fa } = await this.getAccountAndState(accountId)
        if (has2fa) {
            return await this.twoFactor.addKey(account, publicKey, contractId, fullAccess)
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

    async addLedgerAccessKey(accountId, ledgerPublicKey) {
        await setKeyMeta(ledgerPublicKey, { type: 'ledger' })
        await this.getAccount(accountId).addKey(ledgerPublicKey)
        await this.postSignedJson('/account/ledgerKeyAdded', { accountId, publicKey: ledgerPublicKey.toString() })
    }

    async connectLedger(ledgerPublicKey) {
        const accessKeys =  await this.getAccessKeys()
        const ledgerKeyConfirmed = accessKeys.map(key => key.public_key).includes(ledgerPublicKey.toString())

        if (ledgerKeyConfirmed) {
            await setKeyMeta(ledgerPublicKey, { type: 'ledger' })
        }

    }

    async disableLedger() {
        const account = this.getAccount(this.accountId)
        const keyPair = KeyPair.fromRandom('ed25519')
        await account.addKey(keyPair.publicKey)
        await this.keyStore.setKey(NETWORK_ID, this.accountId, keyPair)

        const publicKey = await this.getLedgerPublicKey()
        await this.removeAccessKey(publicKey)
        await this.getAccessKeys(this.accountId)

        await this.deleteRecoveryMethod({ kind: 'ledger', publicKey: publicKey.toString() })
        
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

    async getLedgerAccountIds() {
        const publicKey = await this.getLedgerPublicKey()
        await store.dispatch(setLedgerTxSigned(true))
        // TODO: getXXX methods shouldn't be modifying the state
        await setKeyMeta(publicKey, { type: 'ledger' })
        const accountIds = await getAccountIds(publicKey)

        const checkedAccountIds = (await Promise.all(
            accountIds
                .map(async (accountId) => {
                    const accountKeys = await this.getAccount(accountId).getAccessKeys();
                    return accountKeys.find(({ public_key }) => public_key === publicKey.toString()) ? accountId : null
                })
            )
        )
        .filter(accountId => accountId)

        if (!checkedAccountIds.length) {
            throw new WalletError('No accounts were found.', 'signInLedger.getLedgerAccountIds.noAccounts')
        }

        return checkedAccountIds
    }

    async addLedgerAccountId(accountId) {
        const accessKeys =  await this.getAccessKeys(accountId)
        const localAccessKey = await this.getLocalAccessKey(accountId, accessKeys)

        const newKeyPair = await this.addWalletMetadataAccessKeyIfNeeded(accountId, localAccessKey)
        await this.setKey(accountId, newKeyPair)
    }

    async saveAndSelectLedgerAccounts(accounts) {
        const accountIds = Object.keys(accounts)

        for (let i = 0; i < accountIds.length; i++) {
            const accountId = accountIds[i]
            if (i === accountIds.length - 1) {
                await this.saveAndSelectAccount(accountId)
            } else {
                await this.saveAccount(accountId)
            }
        }

        return {
            numberOfAccounts: accountIds.length
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
        // if there's a tempTwoFactorAccount (recovery with 2fa) use that account
        return await sendJson('POST', ACCOUNT_HELPER_URL + path, {
            ...options,
            ...(await this.signatureFor(this.tempTwoFactorAccount ? this.tempTwoFactorAccount : this))
        });
    }

    async initializeRecoveryMethod(accountId, method, isNew) {
        const { seedPhrase } = generateSeedPhrase()
        const body = {
            accountId,
            method,
            seedPhrase
        }
        if (isNew) {
            await sendJson('POST', ACCOUNT_HELPER_URL + '/account/initializeRecoveryMethodForTempAccount', body);
        } else {
            await this.postSignedJson('/account/initializeRecoveryMethod', body);
        }
        return seedPhrase;
    }

    async validateSecurityCode(accountId, method, securityCode, isNew) {
        const body = {
            accountId,
            method,
            securityCode
        }
        if (isNew) {
            return await sendJson('POST', ACCOUNT_HELPER_URL + '/account/validateSecurityCodeForTempAccount', body);
        }
        return await this.postSignedJson('/account/validateSecurityCode', body);
    }

    async getRecoveryMethods(account) {
        const accountId = account ? account.accountId : this.accountId
        return {
            accountId,
            data: await this.postSignedJson('/account/recoveryMethods', { accountId }, account)
        }
    }

    async setupRecoveryMessage(accountId, method, securityCode, isNew, fundingContract, fundingKey, recoverySeedPhrase) {
        const { secretKey } = parseSeedPhrase(recoverySeedPhrase)
        const recoveryKeyPair = KeyPair.fromString(secretKey)

        // TODO: Remove isNew parameter from everywhere. Stuff available on chain should be queried from chain.
        try {
            await wallet.getAccount(accountId).state();
            isNew = false;
        } catch (e) {
            if (e.toString().includes(`does not exist while viewing`)) {
                isNew = true;
            }
        }

        let securityCodeResult = await this.validateSecurityCode(accountId, method, securityCode, isNew);
        if (!securityCodeResult || securityCodeResult.length === 0) {
            console.log('INVALID CODE', securityCodeResult)
            return
        }

        if (isNew) {
            await wallet.saveAccount(accountId, recoveryKeyPair);
            await this.createNewAccount(accountId, fundingContract, fundingKey, recoveryKeyPair.publicKey)
        }

        throw "OOPS"

        const newKeyPair = isNew ? KeyPair.fromRandom('ed25519') : recoveryKeyPair
        const newPublicKey = newKeyPair.publicKey
        const { account, has2fa } = await this.getAccountAndState(accountId)
        const accountKeys = await account.getAccessKeys();

        if (has2fa) {
            await this.addAccessKey(account.accountId, account.accountId, convertPKForContract(newPublicKey))
        } else {
            if (!accountKeys.some(it => it.public_key.endsWith(newPublicKey))) {
                await account.addKey(newPublicKey);
            }
        }

        if (isNew) {
            await this.saveAccount(accountId, newKeyPair)
        }
    }

    async deleteRecoveryMethod({ kind, publicKey }, deleteAllowed = true) {
        const accessKeys =  await this.getAccessKeys()
        const pubKeys = accessKeys.map(key => key.public_key)

        if (deleteAllowed) {
            if (pubKeys.includes(publicKey)) {
                await this.removeAccessKey(publicKey)
            }
            await this.postSignedJson('/account/deleteRecoveryMethod', {
                accountId: this.accountId,
                kind,
                publicKey
            })
        } else {
            throw new WalletError('Cannot delete last recovery method', 'errors.recoveryMethods.lastMethod')
        }
    }

    async recoverAccountSeedPhrase(seedPhrase, accountId, fromSeedPhraseRecovery = true) {
        const { publicKey, secretKey } = parseSeedPhrase(seedPhrase)

        const tempKeyStore = new nearApiJs.keyStores.InMemoryKeyStore()
        const accountIds = accountId ? [accountId] : await getAccountIds(publicKey)

        const connection = nearApiJs.Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
            signer: new nearApiJs.InMemorySigner(tempKeyStore)
        })
        await Promise.all(accountIds.map(async (accountId, i) => {
            const account = new nearApiJs.Account(connection, accountId)
            this.accountId = accountId
            const keyPair = KeyPair.fromString(secretKey)
            await tempKeyStore.setKey(NETWORK_ID, accountId, keyPair)
            account.keyStore = tempKeyStore
            account.inMemorySigner = new nearApiJs.InMemorySigner(tempKeyStore)
            this.tempTwoFactorAccount = account
            const newKeyPair = KeyPair.fromRandom('ed25519')
            const state = await account.state()
            const isMultiSigAccount = MULTISIG_CONTRACT_HASHES.includes(state.code_hash)
            
            if (isMultiSigAccount) {
                if (!fromSeedPhraseRecovery) {
                    await this.addAccessKey(accountId, accountId, convertPKForContract(newKeyPair.publicKey))
                } else {
                    const actions = [
                        nearApiJs.transactions.addKey(newKeyPair.publicKey, nearApiJs.transactions.functionCallAccessKey(accountId, METHOD_NAMES_LAK, null))
                    ]
                    await account.signAndSendTransaction(accountId, actions)
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
        const { account, has2fa } = await this.getAccountAndState(accountId)
        if (has2fa) {
            await this.twoFactor.signAndSendTransactions(account, transactions)
            return
        }
        store.dispatch(setSignTransactionStatus('in-progress'))
        for (let { receiverId, nonce, blockHash, actions } of transactions) {
            const [, signedTransaction] = await nearApiJs.transactions.signTransaction(receiverId, nonce, actions, blockHash, this.connection.signer, accountId, NETWORK_ID)
            let { status, transaction } = await this.connection.provider.sendTransaction(signedTransaction)

            if (status.Failure !== undefined) {
                throw new Error(`Transaction failure for transaction hash: ${transaction.hash}, receiver_id: ${transaction.receiver_id} .`)
            }
        }
    }
}

export const wallet = new Wallet()
