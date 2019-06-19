import * as nearlib from 'nearlib'
import sendJson from 'fetch-send-json'

const WALLET_CREATE_NEW_ACCOUNT_URL = `/create/`

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID || 'testnet'
const ACCOUNT_HELPER_URL = process.env.REACT_APP_ACCOUNT_HELPER_URL || 'https://studio.nearprotocol.com/contract-api'
const CONTRACT_CREATE_ACCOUNT_URL = `${ACCOUNT_HELPER_URL}/account`
const NODE_URL = process.env.REACT_APP_NODE_URL || 'https://studio.nearprotocol.com/devnet/'
const HELPER_KEY = process.env.REACT_APP_ACCOUNT_HELPER_KEY || '22skMptHjFWNyuEWY22ftn2AbLPSYpmYwGJRGwpNHbTV'

const KEY_UNIQUE_PREFIX = '_4:'
const KEY_WALLET_ACCOUNTS = KEY_UNIQUE_PREFIX + 'wallet:accounts_v2'
const KEY_ACTIVE_ACCOUNT_ID = KEY_UNIQUE_PREFIX + 'wallet:active_account_id_v2'

const ACCOUNT_ID_REGEX = /^[a-z0-9@._-]{5,32}$/

export class Wallet {
   constructor() {
      this.key_store = new nearlib.keyStores.BrowserLocalStorageKeyStore()
      this.connection = nearlib.Connection.fromConfig({
         networkId: NETWORK_ID,
         provider: { type: 'JsonRpcProvider', args: { url: NODE_URL } },
         signer: { type: 'InMemorySigner', keyStore: this.key_store }
      })
      this.accounts = JSON.parse(
         localStorage.getItem(KEY_WALLET_ACCOUNTS) || '{}'
      )
      this.accountId = localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID) || ''
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
         WALLET_CREATE_NEW_ACCOUNT_URL +
         '?' +
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

   async loadAccount(accountId) {
      if (!(accountId in this.accounts)) {
         throw new Error('Account ' + accountId + " doesn't exist.")
      }
      return await this.getAccount(this.accountId).state()
   }

   async getAccountDetails() {
      if (!this.accountId) return null
      return await this.getAccount(this.accountId).getAccountDetails(localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID))
   }

   async removeAccessKey(publicKey) {
      return await this.getAccount(this.accountId).removeKey(publicKey)
   }

   async checkAccount(accountId) {
      if (accountId !== this.accountId) {
         return await this.getAccount(accountId).state()
      } else {
         throw new Error('You are logged into account ' + accountId + ' .')
      }
   }

   async checkNewAccount(accountId) {
      if (accountId in this.accounts) {
         throw new Error('Account ' + accountId + ' already exists.')
      }
      let remoteAccount = null
      try {
         remoteAccount = await this.getAccount(accountId).state()
      } catch (e) {
         // expected
      }
      if (!!remoteAccount) {
         throw new Error('Account ' + accountId + ' already exists.')
      }
   }

   async createNewAccount(accountId) {
      this.checkNewAccount()

      const keyPair = nearlib.KeyPair.fromRandom('ed25519')
      await sendJson('POST', CONTRACT_CREATE_ACCOUNT_URL, {
         newAccountId: accountId,
         newAccountPublicKey: keyPair.getPublicKey()
      })
      await this.saveAndSelectAccount(accountId, keyPair);
   }

   async saveAndSelectAccount(accountId, keyPair) {
      await this.key_store.setKey(NETWORK_ID, accountId, keyPair)
      this.accounts[accountId] = true
      this.accountId = accountId
      this.save()
   }

   async addAccessKey(accountId, contractId, publicKey, successUrl) {
      await this.getAccount(this.accountId).addKey(
         publicKey,
         contractId,
         '', // methodName
         '', // fundingOwner
         0 // fundingAmount
      )
      const parsedUrl = new URL(successUrl)
      parsedUrl.searchParams.set('account_id', accountId)
      parsedUrl.searchParams.set('public_key', publicKey)
      const redirectUrl = parsedUrl.href
      window.location.href = redirectUrl
   }

   clearState() {
      this.accounts = {}
      this.accountId = ''
      this.save()
   }

   getAccount(accountId) {
      return new nearlib.Account(this.connection, accountId)
   }

   requestCode(phoneNumber, accountId) {
      return sendJson('POST', `${ACCOUNT_HELPER_URL}/account/${phoneNumber}/${accountId}/requestCode`)
   }

   async validateCode(phoneNumber, accountId, postData) {
      return sendJson('POST', `${ACCOUNT_HELPER_URL}/account/${phoneNumber}/${accountId}/validateCode`, postData)
   }

   async setupAccountRecovery(phoneNumber, accountId, securityCode) {
      const account = this.getAccount(accountId)
      const state = await account.state()
      if (!state.public_keys.some(key => nearlib.KeyPair.encodeBufferInBs58(Buffer.from(key)) === HELPER_KEY)) {
         await account.addKey(HELPER_KEY)
      }

      const { signature } = await this.connection.signer.signBuffer(Buffer.from(securityCode), accountId)
      await this.validateCode(phoneNumber, accountId, { securityCode, signature })
   }

   async recoverAccount(phoneNumber, accountId, securityCode) {
      const keyPair = nearlib.KeyPair.fromRandom('ed25519')
      await this.validateCode(phoneNumber, accountId, { securityCode, publicKey: keyPair.publicKey })
      await this.saveAndSelectAccount(accountId, keyPair)
   }
}
