import * as nearApiJs from 'near-api-js'
import { KeyPair } from 'near-api-js'
import sendJson from 'fetch-send-json'
import { parseSeedPhrase } from 'near-seed-phrase'
import { PublicKey } from 'near-api-js/lib/utils'
import { KeyType } from 'near-api-js/lib/utils/key_pair'
import { store } from '..'
import { getAccessKeys } from '../actions/account'
import { generateSeedPhrase } from 'near-seed-phrase';
import { getAccountIds } from './explorer-api'
import { WalletError } from './walletError'
import { setAccountConfirmed, getAccountConfirmed, removeAccountConfirmed} from './localStorage'

export const WALLET_CREATE_NEW_ACCOUNT_URL = 'create'
export const WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS = ['create', 'set-recovery', 'setup-seed-phrase', 'recover-account', 'recover-seed-phrase', 'sign-in-ledger']
export const WALLET_LOGIN_URL = 'login'
export const WALLET_SIGN_URL = 'sign'
export const ACCOUNT_HELPER_URL = process.env.REACT_APP_ACCOUNT_HELPER_URL || 'https://near-contract-helper.onrender.com'
export const EXPLORER_URL = process.env.EXPLORER_URL || 'https://explorer.testnet.near.org';
export const IS_MAINNET = process.env.REACT_APP_IS_MAINNET === 'true' || process.env.REACT_APP_IS_MAINNET === 'yes'
export const ACCOUNT_ID_SUFFIX = process.env.REACT_APP_ACCOUNT_ID_SUFFIX || 'testnet'

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID || 'default'
const CONTRACT_CREATE_ACCOUNT_URL = `${ACCOUNT_HELPER_URL}/account`
export const NODE_URL = process.env.REACT_APP_NODE_URL || 'https://rpc.nearprotocol.com'

const KEY_UNIQUE_PREFIX = '_4:'
const KEY_WALLET_ACCOUNTS = KEY_UNIQUE_PREFIX + 'wallet:accounts_v2'
const KEY_ACTIVE_ACCOUNT_ID = KEY_UNIQUE_PREFIX + 'wallet:active_account_id_v2'
const ACCESS_KEY_FUNDING_AMOUNT = process.env.REACT_APP_ACCESS_KEY_FUNDING_AMOUNT || '100000000'
const ACCOUNT_ID_REGEX = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/
export const keyAccountConfirmed = (accountId) => `wallet.account:${accountId}:${NETWORK_ID}:confirmed`

const WALLET_METADATA_METHOD = '__wallet__metadata'

export const ACCOUNT_CHECK_TIMEOUT = 500
export const TRANSACTIONS_REFRESH_INTERVAL = 10000

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
        await this.getAccount(this.accountId).sendMoney(receiverId, amount)
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
        return await this.getAccount(this.accountId).deleteKey(publicKey)
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

        for (const { public_key } of keysToRemove) {
            await account.deleteKey(public_key)
        }

        let newLocalKeyPair = await this.addWalletMetadataAccessKeyIfNeeded(this.accountId, localAccessKey)
        if (newLocalKeyPair) {
            if (localAccessKey) {
                await account.deleteKey(localAccessKey.public_key)
            }
            await this.keyStore.setKey(NETWORK_ID, this.accountId, newLocalKeyPair)
        }

        const { data: recoveryMethods } =  await this.getRecoveryMethods();
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

    async createNewAccount(accountId, fundingKey, fundingContract) {
        this.checkNewAccount(accountId);
        const keyPair = KeyPair.fromRandom('ed25519');

        try {
            if (fundingKey && fundingContract) {
                await this.createNewAccountLinkdrop(accountId, fundingKey, fundingContract, keyPair)
                await this.keyStore.removeKey(NETWORK_ID, fundingContract)
            } else {
                await sendJson('POST', CONTRACT_CREATE_ACCOUNT_URL, {
                    newAccountId: accountId,
                    newAccountPublicKey: keyPair.publicKey.toString()
                })
            }
            await this.saveAndSelectAccount(accountId, keyPair);
        } catch(e) {
            if (e.toString().indexOf('send_tx_commit has timed out') !== -1 || e instanceof TypeError) {
                await this.saveAndSelectAccount(accountId, keyPair)
            }
            else {
                throw e
            }
        }
    }

    async createNewAccountLinkdrop(accountId, fundingKey, fundingContract, keyPair) {
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
        setAccountConfirmed(this.accountId, false)
        this.save()
    }

    async saveAccount(accountId, keyPair) {
        if (keyPair) {
            await this.keyStore.setKey(NETWORK_ID, accountId, keyPair)
        }
        this.accounts[accountId] = true
    }

    async addAccessKey(accountId, contractId, publicKey) {
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

    async getBalance(accountId) {
        let userAccountId = this.accountId;
        if (accountId) {
            userAccountId = accountId;
        }
        return await this.getAccount(userAccountId).getAccountBalance()
    }

    async signatureFor(accountId) {
        const blockNumber = String((await this.connection.provider.status()).sync_info.latest_block_height);
        const signed = await this.inMemorySigner.signMessage(Buffer.from(blockNumber), accountId, NETWORK_ID);
        const blockNumberSignature = Buffer.from(signed.signature).toString('base64');
        return { blockNumber, blockNumberSignature };
    }

    async postSignedJson(path, options) {
        return await sendJson('POST', ACCOUNT_HELPER_URL + path, {
            ...options,
            ...(await this.signatureFor(this.accountId))
        });
    }

    async initializeRecoveryMethod(accountId, method) {
        return await this.postSignedJson('/account/initializeRecoveryMethod', {
            accountId,
            method
        });
    }

    async validateSecurityCode(accountId, method, securityCode) {
        return await this.postSignedJson('/account/validateSecurityCode', {
            accountId,
            method,
            securityCode
        });
    }

    async getRecoveryMethods() {
        return {
            accountId: this.accountId,
            data: await this.postSignedJson('/account/recoveryMethods', { accountId: this.accountId })
        }
    }

    async setupRecoveryMessage(accountId, method, securityCode) {
        await this.validateSecurityCode(accountId, method, securityCode);

        const { seedPhrase, publicKey } = generateSeedPhrase();

        const account = this.getAccount(accountId)
        const accountKeys = await account.getAccessKeys();
        if (!accountKeys.some(it => it.public_key.endsWith(publicKey))) {
            await account.addKey(publicKey);
        }

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
        await this.postSignedJson('/account/deleteRecoveryMethod', {
            accountId: this.accountId,
            kind,
            publicKey
        })
        await this.removeAccessKey(publicKey)
    }

    async recoverAccountSeedPhrase(seedPhrase) {
        const { publicKey, secretKey } = parseSeedPhrase(seedPhrase)
        const accountIds = await getAccountIds(publicKey)

        if (!accountIds.length) {
            throw new WalletError('Cannot find matching public key', 'account.recoverAccount.errorInvalidSeedPhrase', { publicKey })
        }

        const tempKeyStore = new nearApiJs.keyStores.InMemoryKeyStore()

        const connection = nearApiJs.Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
            signer: new nearApiJs.InMemorySigner(tempKeyStore)
        })

        await Promise.all(accountIds.map(async (accountId, i) => {
            const account = new nearApiJs.Account(connection, accountId)

            const keyPair = KeyPair.fromString(secretKey)
            await tempKeyStore.setKey(NETWORK_ID, accountId, keyPair)

            // generate new keypair for this browser
            const newKeyPair = KeyPair.fromRandom('ed25519')
            await account.addKey(newKeyPair.publicKey)

            if (i === accountIds.length - 1) {
                await this.saveAndSelectAccount(accountId, newKeyPair)
            } else {
                await this.saveAccount(accountId, newKeyPair)
            }
        }))

        return {
            numberOfAccounts: accountIds.length,
            accountList: accountIds.flatMap((accountId) => accountId).join(', ')
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
