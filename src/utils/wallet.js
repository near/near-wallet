import nearlib from 'nearlib'
import sendJson from 'fetch-send-json'

const WALLET_CREATE_NEW_ACCOUNT_URL = `/create/`

const ACCOUNT_HELPER_URL = process.env.REACT_APP_ACCOUNT_HELPER_URL || 'https://studio.nearprotocol.com/contract-api'
const CONTRACT_CREATE_ACCOUNT_URL = `${ACCOUNT_HELPER_URL}/account`
const NODE_URL = process.env.REACT_APP_NODE_URL || 'https://studio.nearprotocol.com/devnet'
const HELPER_KEY = process.env.REACT_APP_ACCOUNT_HELPER_KEY || '22skMptHjFWNyuEWY22ftn2AbLPSYpmYwGJRGwpNHbTV'

const KEY_UNIQUE_PREFIX = '_4:'
const KEY_WALLET_ACCOUNTS = KEY_UNIQUE_PREFIX + 'wallet:accounts_v2'
const KEY_ACTIVE_ACCOUNT_ID = KEY_UNIQUE_PREFIX + 'wallet:active_account_id_v2'

const ACCOUNT_ID_REGEX = /^[a-z0-9@._-]{5,32}$/

export class Wallet {
   constructor() {
      this.key_store = new nearlib.BrowserLocalStorageKeystore()
      this.near = nearlib.Near.createDefaultConfig(NODE_URL)
      this.account = new nearlib.Account(this.near.nearClient);
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

   async sendTokens(senderId, receiverId, amount) {
      return this.near.waitForTransactionResult(
         await this.near.sendTokens(amount, senderId, receiverId))
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

   async loadAccount(accountId, history) {
      if (!(accountId in this.accounts)) {
         throw new Error('Account ' + accountId + " doesn't exist.")
      }
      return await this.near.nearClient.viewAccount(accountId)
   }

   async getAccountDetails() {
      return await this.account.getAccountDetails(localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID))
   }

   async removeAccessKey(publicKey) {
      return await this.account.removeAccessKey(this.accountId, publicKey)
   }

   async checkAccount(accountId) {
      if (accountId !== this.accountId) {
         return await this.near.nearClient.viewAccount(accountId)
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
         remoteAccount = await this.near.nearClient.viewAccount(accountId)
      } catch (e) {
         // expected
      }
      if (!!remoteAccount) {
         throw new Error('Account ' + accountId + ' already exists.')
      }
   }

   async createNewAccount(accountId) {
      if (accountId in this.accounts) {
         throw new Error('Account ' + accountId + ' already exists.')
      }
      let remoteAccount = null
      try {
         remoteAccount = await this.near.nearClient.viewAccount(accountId)
      } catch (e) {
         // expected
      }
      if (!!remoteAccount) {
         throw new Error('Account ' + accountId + ' already exists.')
      }
      let keyPair = await nearlib.KeyPair.fromRandomSeed()
      return await new Promise((resolve, reject) => {
         let data = JSON.stringify({
            newAccountId: accountId,
            newAccountPublicKey: keyPair.getPublicKey()
         })

         let xhr = new XMLHttpRequest()
         xhr.open('POST', CONTRACT_CREATE_ACCOUNT_URL)
         xhr.setRequestHeader('Content-Type', 'application/json')
         xhr.onload = () => {
            if (xhr.status === 200) {
               this.saveAndSelectAccount(accountId, keyPair);
               resolve(xhr)
            } else if (xhr.status !== 200) {
               reject(xhr.responseText)
            }
         }
         xhr.send(data)
      })
   }

   async saveAndSelectAccount(accountId, keyPair) {
      await this.key_store.setKey(accountId, keyPair)
      this.accounts[accountId] = true
      this.accountId = accountId
      this.save()
   }

   async addAccessKey(accountId, contractId, publicKey, successUrl) {
      const addAccessKeyResponse = await this.account.addAccessKey(
         accountId,
         publicKey,
         contractId,
         '', // methodName
         '', // fundingOwner
         0 // fundingAmount
      )
      try {
         const result = await this.near.waitForTransactionResult(addAccessKeyResponse)
         const parsedUrl = new URL(successUrl)
         parsedUrl.searchParams.set('account_id', accountId)
         parsedUrl.searchParams.set('public_key', publicKey)
         const redirectUrl = parsedUrl.href
         if (result.status === 'Completed') {
            window.location.href = redirectUrl
         }
      } catch (e) {
         // TODO: handle errors
         console.log('Error on adding access key ', e)
      }
   }

   clearState() {
      this.accounts = {}
      this.accountId = ''
      this.save()
   }

   requestCode(phoneNumber, accountId) {
      return sendJson('POST', `${ACCOUNT_HELPER_URL}/account/${phoneNumber}/${accountId}/requestCode`)
   }

   async validateCode(phoneNumber, accountId, postData) {
      return sendJson('POST', `${ACCOUNT_HELPER_URL}/account/${phoneNumber}/${accountId}/validateCode`, postData)
   }

   async setupAccountRecovery(phoneNumber, accountId, securityCode) {
      const nearAccount = await this.near.nearClient.viewAccount(accountId);
      if (!nearAccount.public_keys.some(key => nearlib.KeyPair.encodeBufferInBs58(Buffer.from(key)) === HELPER_KEY)) {
         await this.near.waitForTransactionResult(
            await this.account.addAccessKey(accountId, HELPER_KEY));
      }

      const signer = this.near.nearClient.signer;
      const { signature } = await signer.signBuffer(Buffer.from(securityCode), accountId);
      await this.validateCode(phoneNumber, accountId, { securityCode, signature })
   }

   async recoverAccount(phoneNumber, accountId, securityCode) {
      const keyPair = nearlib.KeyPair.fromRandomSeed()
      await this.validateCode(phoneNumber, accountId, { securityCode, publicKey: keyPair.publicKey })
      await this.saveAndSelectAccount(accountId, keyPair)
   }
}
