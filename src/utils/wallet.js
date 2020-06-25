import * as nearApiJs from 'near-api-js'
import { KeyPair } from 'near-api-js'
import sendJson from 'fetch-send-json'
import { parseSeedPhrase } from 'near-seed-phrase'
import { createClient } from 'near-ledger-js'
import { PublicKey } from 'near-api-js/lib/utils'
import { KeyType } from 'near-api-js/lib/utils/key_pair'
import { store } from '..'
import { getAccessKeys } from '../actions/account'
import { generateSeedPhrase } from 'near-seed-phrase';
import { getAccountId } from './explorer-api'
import { WalletError } from './walletError'

export const WALLET_CREATE_NEW_ACCOUNT_URL = 'create'
export const WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS = ['create', 'set-recovery', 'setup-seed-phrase', 'recover-account', 'recover-seed-phrase']
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

        const getLedgerKey = async (accountId, networkId) => {
            let state = store.getState()
            if (!state.account.fullAccessKeys) {
                await store.dispatch(getAccessKeys(accountId))
                state = store.getState()
            }
            const accessKeys = state.account.fullAccessKeys
            if (accessKeys && state.account.accountId === accountId) {
                const localKey = await this.getLocalAccessKey(accessKeys)
                const ledgerKey = accessKeys.find(accessKey => accessKey.meta.type === 'ledger')
                if (ledgerKey && !localKey) {
                    return PublicKey.from(ledgerKey.public_key)
                }
            }
            return null
        }

        const inMemorySigner = this.inMemorySigner
        this.signer = {
            async getPublicKey(accountId, networkId) {
                return (await getLedgerKey(accountId)) || (await inMemorySigner.getPublicKey(accountId, networkId))
            },
            async signMessage(message, accountId, networkId) {
                if (await getLedgerKey(accountId)) {
                    // TODO: Use network ID
                    const client = await createClient()
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

    async getLocalAccessKey(accessKeys) {
        const localPublicKey = await this.inMemorySigner.getPublicKey(this.accountId, NETWORK_ID)
        return localPublicKey && accessKeys.find(({ public_key }) => public_key === localPublicKey.toString())
    }

    save() {
        localStorage.setItem(KEY_ACTIVE_ACCOUNT_ID, this.accountId)
        localStorage.setItem(KEY_WALLET_ACCOUNTS, JSON.stringify(this.accounts))
    }

    getAccountId() {
        return this.accountId
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

    redirectToCreateAccount(options = {}, history) {
        const param = {
            next_url: window.location.search
        }
        if (options.reset_accounts) {
            param.reset_accounts = true
        }
        //  let url = WALLET_CREATE_NEW_ACCOUNT_URL + "?" + $.param(param)
        let url =
            '/' +
            WALLET_CREATE_NEW_ACCOUNT_URL +
            '/?' +
            Object.keys(param).map(
                (p, i) =>
                    `${i ? '&' : ''}${encodeURIComponent(p)}=${encodeURIComponent(
                        param[p]
                    )}`
            )
        history ? history.push(url) : window.location.replace(url)
    }

    isEmpty() {
        return !this.accounts || !Object.keys(this.accounts).length
    }

    redirectIfEmpty(history) {
        if (this.isEmpty()) {
            this.redirectToCreateAccount({}, history)
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
    async getAccessKeys() {
        if (!this.accountId) return null

        const accessKeys = await this.getAccount(this.accountId).getAccessKeys()
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
        const account = this.getAccount(this.accountId)
        const keysToRemove = accessKeys.filter(({
            access_key: { permission },
            meta: { type }
        }) => permission === 'FullAccess' && type !== 'ledger')


        const localAccessKey = await this.getLocalAccessKey(accessKeys)

        const WALLET_METADATA_METHOD = '__wallet__metadata'
        let newLocalKeyPair
        if (!localAccessKey || (!localAccessKey.access_key.permission.FunctionCall ||
                !localAccessKey.access_key.permission.FunctionCall.method_names.includes(WALLET_METADATA_METHOD))) {
            // NOTE: This key isn't used to call actual contract method, just used to verify connection with account in private DB
            newLocalKeyPair = KeyPair.fromRandom('ed25519')
            await account.addKey(newLocalKeyPair.getPublicKey(), this.accountId, WALLET_METADATA_METHOD, '0')
        }

        for (const { public_key } of keysToRemove) {
            if (localAccessKey && public_key === localAccessKey.public_key) {
                continue;
            }
            await account.deleteKey(public_key)
        }
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

        if (fundingKey && fundingContract) {
            await this.createNewAccountLinkdrop(accountId, fundingKey, fundingContract, keyPair);
            await this.keyStore.removeKey(NETWORK_ID, fundingContract)

        } else {
            await sendJson('POST', CONTRACT_CREATE_ACCOUNT_URL, {
                newAccountId: accountId,
                newAccountPublicKey: keyPair.publicKey.toString()
            })
        }

        await this.saveAndSelectAccount(accountId, keyPair);
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
        this.save()
    }

    async saveAccount(accountId, keyPair) {
        await this.keyStore.setKey(NETWORK_ID, accountId, keyPair)
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
        const client = await createClient()
        const rawPublicKey = await client.getPublicKey()
        const publicKey = new PublicKey({ keyType: KeyType.ED25519, data: rawPublicKey })
        await setKeyMeta(publicKey, { type: 'ledger' })
        return await this.getAccount(accountId).addKey(publicKey)
    }

    async getAvailableKeys() {
        // TODO: Return additional keys (e.g. Ledger)
        return [(await this.keyStore.getKey(NETWORK_ID, this.accountId)).publicKey]
    }

    clearState() {
        this.accounts = {}
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
        const accountsIds = await getAccountId(publicKey)

        if (!accountsIds.length) {
            throw new WalletError('Cannot find matching public key', 'account.recoverAccount.errorInvalidSeedPhrase', { aaa: 'bbb' })
        }

        const tempKeyStore = new nearApiJs.keyStores.InMemoryKeyStore()

        const connection = nearApiJs.Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
            signer: new nearApiJs.InMemorySigner(tempKeyStore)
        })

        await Promise.all(accountsIds.map(async ({ account_id: accountId }, i, { length }) => {
            const account = new nearApiJs.Account(connection, accountId)

            const keyPair = KeyPair.fromString(secretKey)
            await tempKeyStore.setKey(NETWORK_ID, accountId, keyPair)

            // generate new keypair for this browser
            const newKeyPair = KeyPair.fromRandom('ed25519')
            await account.addKey(newKeyPair.publicKey)

            if (i === length - 1) {
                await this.saveAndSelectAccount(accountId, newKeyPair)
            } else {
                await this.saveAccount(accountId, newKeyPair)
            }
        }))

        return {
            numberOfAccounts: accountsIds.length,
            accountList: accountsIds.flatMap((accountId) => accountId.account_id).join(', ')
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
