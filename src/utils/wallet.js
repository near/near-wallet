import * as nearApiJs from 'near-api-js'
import { KeyPair } from 'near-api-js'
import sendJson from 'fetch-send-json'
import { parseSeedPhrase } from 'near-seed-phrase'
import { createClient } from 'near-ledger-js'
import { PublicKey } from 'near-api-js/lib/utils'
import { KeyType } from 'near-api-js/lib/utils/key_pair'
import { store } from '..'
import { getAccessKeys, promptTwoFactor } from '../actions/account'
import { generateSeedPhrase } from 'near-seed-phrase';
import { getAccountId } from './explorer-api'

export const WALLET_CREATE_NEW_ACCOUNT_URL = 'create'
export const WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS = ['create', 'set-recovery', 'setup-seed-phrase', 'recover-account', 'recover-seed-phrase']
export const WALLET_LOGIN_URL = 'login'
export const WALLET_SIGN_URL = 'sign'
export const ACCOUNT_HELPER_URL = process.env.REACT_APP_ACCOUNT_HELPER_URL || 'https://near-contract-helper-2fa.onrender.com'
export const EXPLORER_URL = process.env.EXPLORER_URL || 'https://explorer.testnet.near.org';
export const IS_MAINNET = process.env.REACT_APP_IS_MAINNET === 'true' || process.env.REACT_APP_IS_MAINNET === 'yes'
export const ACCOUNT_ID_SUFFIX = 'dev2' || process.env.REACT_APP_ACCOUNT_ID_SUFFIX || 'testnet'

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID || 'default'
const CONTRACT_CREATE_ACCOUNT_URL = `${ACCOUNT_HELPER_URL}/account`
export const NODE_URL = process.env.REACT_APP_NODE_URL || 'https://rpc.nearprotocol.com'

const KEY_UNIQUE_PREFIX = '_4:'
const KEY_WALLET_ACCOUNTS = KEY_UNIQUE_PREFIX + 'wallet:accounts_v2'
const KEY_ACTIVE_ACCOUNT_ID = KEY_UNIQUE_PREFIX + 'wallet:active_account_id_v2'
const ACCESS_KEY_FUNDING_AMOUNT = process.env.REACT_APP_ACCESS_KEY_FUNDING_AMOUNT || '100000000'
const ACCOUNT_ID_REGEX = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/
const ACCOUNT_NO_CODE_HASH = '11111111111111111111111111111111'
const METHOD_NAMES_LAK = ["add_request", "add_request_and_confirm", "delete_request", "confirm"]
const METHOD_NAMES_CONFIRM = ["confirm"]


export const ACCOUNT_CHECK_TIMEOUT = 500
export const TRANSACTIONS_REFRESH_INTERVAL = 10000


/********************************
Managing 2fa requests
********************************/
export const getRequest = () => {
    return JSON.parse(localStorage.getItem(`__multisigRequest`) || `{}`)
}
export const setRequest = (data) => {
    localStorage.setItem(`__multisigRequest`, JSON.stringify(data))
}
// helpers
const splitPK = (pk) => pk.split(':')[1]
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

    async get2faMethod(account) {
        return (await this.getRecoveryMethods(account)).data.filter((m) => m.kind.indexOf('2fa-') > -1).map(({ kind, detail }) => ({ kind, detail }))[0]
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
            await this.sendMoneyMultisig(account, receiverId, amount)
        } else {
            await account.sendMoney(receiverId, amount)
        }
    }
    /********************************
    Multisig Methods
    ********************************/
    async sendMoneyMultisig(account, receiverId, amount) {
        const {accountId} = account
        const contract = this.getContract(account)
        const request_id = await this.getNextRequestId(contract)
        const request = {
            receiver_id: receiverId,
            actions: [{ type: 'Transfer', amount }]
        }
        await this.addRequestAndConfirm(contract, request)
        const request_id_after = await this.getNextRequestId(contract)
        if (request_id_after > request_id) {
            // request was successfully added, send verification code to 2fa method
            const data = { request_id, request }
            const method = await this.get2faMethod()
            await this.sendTwoFactor(accountId, method, request_id, data)
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
        const accessKeys = await this.getAccessKeys()
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

    async createNewAccount(accountId, fundingContract, fundingKey) {
        this.checkNewAccount(accountId);
        const keyPair = KeyPair.fromRandom('ed25519');
        if (fundingKey && fundingContract) {
            await this.createNewAccountLinkdrop(accountId, fundingContract, fundingKey, keyPair);
            await this.keyStore.removeKey(NETWORK_ID, fundingContract)

        } else {
            await sendJson('POST', CONTRACT_CREATE_ACCOUNT_URL, {
                newAccountId: accountId,
                newAccountPublicKey: keyPair.publicKey.toString()
            })
        }
        await this.saveAndSelectAccount(accountId, keyPair);
    }

    async createNewAccountLinkdrop(accountId, fundingContract, fundingKey, keyPair) {
        const account = this.getAccount(fundingContract);


        await this.keyStore.setKey(
            NETWORK_ID, fundingContract,
            KeyPair.fromString(fundingKey)
        )

        console.log(this.keyStore, KeyPair.fromString(fundingKey))

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

    async getAccountAndState(accountId) {
        const account = this.getAccount(accountId)
        const state = await account.state()
        const has2fa = state.code_hash !== ACCOUNT_NO_CODE_HASH
        return { account, state, has2fa }
    }

    async getBalance(accountId) {
        let userAccountId = this.accountId;
        if (accountId) {
            userAccountId = accountId;
        }
        return await this.getAccount(userAccountId).getAccountBalance()
    }

    async signatureFor(accountId, account) {
        if (!account) {
            account = this
        }
        const blockNumber = String((await account.connection.provider.status()).sync_info.latest_block_height);
        const signed = await account.inMemorySigner.signMessage(Buffer.from(blockNumber), accountId, NETWORK_ID);
        const blockNumberSignature = Buffer.from(signed.signature).toString('base64');
        return { blockNumber, blockNumberSignature };
    }

    async postSignedJson(path, options, account) {
        return await sendJson('POST', ACCOUNT_HELPER_URL + path, {
            ...options,
            ...(await this.signatureFor(account ? account.accountId : this.accountId, account))
        });
    }

    async initializeRecoveryMethod(accountId, method) {
        return await this.postSignedJson('/account/initializeRecoveryMethod', {
            accountId,
            method
        });
    }

    async initializeRecoveryMethodForTempAccount(accountId, method) {
        return await sendJson('POST', ACCOUNT_HELPER_URL + '/account/initializeRecoveryMethodForTempAccount', {
            accountId,
            method,
        });
    }

    async validateSecurityCode(accountId, method, securityCode) {
        return await this.postSignedJson('/account/validateSecurityCode', {
            accountId,
            method,
            securityCode
        });
    }

    async validateSecurityCodeForTempAccount(accountId, method, securityCode) {
        return await sendJson('POST', ACCOUNT_HELPER_URL + '/account/validateSecurityCodeForTempAccount', {
            accountId,
            method,
            securityCode
        });
    }

    async initTwoFactor(accountId, method) {
        return await sendJson('POST', ACCOUNT_HELPER_URL + '/2fa/init', {
            accountId,
            method
        });
    }

    async reInitTwoFactor(accountId, method) {
        return this.sendTwoFactor(accountId, method)
    }

    async sendTwoFactor(accountId, method, requestId = '-1', data = {}) {
        if (!accountId) accountId = this.accountId
        if (!method) method = await this.get2faMethod()
        // add request to local storage
        setRequest({ accountId, requestId })
        const serverResponse = sendJson('POST', ACCOUNT_HELPER_URL + '/2fa/send', {
            accountId,
            method,
            requestId,
            data
        }).catch((e) => console.log('/2fa/send failed', e));
        if (requestId !== '-1') {
            // we know the requestId of what we want to confirm so pop the modal now and wait on that
            return new Promise((resolve) => {
                store.dispatch(promptTwoFactor(resolve))
            })
        } else {
            // wait for sever response to reture
            return await serverResponse
        }
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
        return await sendJson('POST', ACCOUNT_HELPER_URL + '/2fa/verify', {
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
    ********************************/
    async deployMultisig() {
        const accountData = await this.loadAccount()
        console.log(accountData)
        if (accountData.temp) {
            console.log('cannot deploy multisig until account is created on chain')
            return
        }
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
        const getAccessKey = await fetch(ACCOUNT_HELPER_URL + '/2fa/getAccessKey', {
            method: 'POST',
            body: JSON.stringify({ accountId })
        }).then((res) => res.json()).catch((e) => console.log(e))
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
        const result = await account.signAndSendTransaction(accountId, actions).catch((e) => {
            console.trace(e)
        })
        console.log(result)

        return { success: !!result, result }
    }

    async createNewAccountForTempAccount(accountId, fundingContract, fundingKey) {
        // create account because recovery is validated
        if (!accountId) {
            // updated to get tempAccount.accountId
            accountId = this.getAccountId()
        }
        const newAccount = await this.createNewAccount(accountId, fundingContract, fundingKey)
        console.log('account created', newAccount)
        // remove the temp account, we now have a real account on chain
        delTempAccount()
        return newAccount
    }

    async setupRecoveryMessage(accountId, method, securityCode, fundingContract, fundingKey) {
        // temp account was set during create account
        const tempAccount = getTempAccount()
        let securityCodeResult
        if (tempAccount && tempAccount.accountId) {
            securityCodeResult = await this.validateSecurityCodeForTempAccount(accountId, method, securityCode);
        } else {
            securityCodeResult = await this.validateSecurityCode(accountId, method, securityCode);
        }
        if (!securityCodeResult || securityCodeResult.length === 0) {
            console.log('INVALID CODE', securityCodeResult)
            return
        }
        // if this is a tempAccount we'll create a new account now
        if (tempAccount && tempAccount.accountId) {
            // added method above, also used for seed recovery
            await this.createNewAccountForTempAccount(accountId, fundingContract, fundingKey)
        }
        // now send recovery seed phrase
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

    async recoverAccountSeedPhrase(seedPhrase, fromLink = false) {
        const { publicKey, secretKey } = parseSeedPhrase(seedPhrase)
        const accountsIds = await getAccountId(publicKey)

        if (!accountsIds.length) {
            throw new Error(`Cannot find matching public key`);
        }

        const tempKeyStore = new nearApiJs.keyStores.InMemoryKeyStore()

        const connection = nearApiJs.Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
            signer: new nearApiJs.InMemorySigner(tempKeyStore)
        })

        await Promise.all(accountsIds.map(async ({ account_id: accountId }, i, { length }) => {
            const account = new nearApiJs.Account(connection, accountId)
            // recovery keypair
            const keyPair = KeyPair.fromString(secretKey)
            await tempKeyStore.setKey(NETWORK_ID, accountId, keyPair)
            // generate new keypair
            const newKeyPair = KeyPair.fromRandom('ed25519')
            // check if multisig deployed
            const state = await account.state()
            console.log('state', state)
            /********************************
            Cases: (1) multisig + LAK recovery, (2) multisig + FAK recovery with seed phrase, (3) no multisig
            ********************************/
            if (state.code_hash !== ACCOUNT_NO_CODE_HASH) {
                if (fromLink) {
                    // (1) multisig + LAK recovery - add LAK using multisig 
                    const contract = this.getContract(account)
                    const request_id = await this.getNextRequestId(contract)
                    const public_key = newKeyPair.publicKey.toString().replace('ed25519:', '')
                    const addKeyAction = {
                        type: 'AddKey', public_key,
                    }
                    // send request
                    const request = {
                        receiver_id: accountId,
                        actions: [addKeyAction]
                    }
                    await this.addRequestAndConfirm(contract, request)
                    // request successfully added to multisig?
                    const request_id_after = await this.getNextRequestId(contract)
                    console.log('request_ids', request_id_after, request_id)
                    if (request_id_after > request_id) {
                        const data = { request_id, request }
                        // needed prove to contract helper we're signer of account
                        account.keyStore = tempKeyStore
                        account.inMemorySigner = new nearApiJs.InMemorySigner(tempKeyStore)
                        console.log('account', account)
                        const method = await this.get2faMethod(account)
                        await this.sendTwoFactor(accountId, method, request_id, data)
                    }
                } else {
                    // (2) multisig + FAK recovery with seed phrase - add LAK directly
                    await account.addKey(newKeyPair.publicKey, nearApiJs.transactions.functionCallAccessKey(accountId, METHOD_NAMES_LAK, null))
                }
            } else {
                // (3) no multisig is deployed - add FAK directly
                await account.addKey(newKeyPair.publicKey)
            }
            if (i === length - 1) {
                await this.saveAndSelectAccount(accountId, newKeyPair)
            } else {
                await this.saveAccount(accountId, newKeyPair)
            }
        }))

        return {
            numberOfAccounts: accountsIds.length,
            accountList: accountsIds.flatMap((accountId) => accountId.account_id).join(', '),
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
