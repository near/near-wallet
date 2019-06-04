import nearlib from 'nearlib'
import sendJson from 'fetch-send-json'

const WALLET_CREATE_NEW_ACCOUNT_URL = `/create/`

const ACCOUNT_HELPER_URL = 'https://studio.nearprotocol.com/contract-api'
const CONTRACT_CREATE_ACCOUNT_URL = `${ACCOUNT_HELPER_URL}/account`
const NODE_URL = 'https://studio.nearprotocol.com/devnet'

const KEY_UNIQUE_PREFIX = '_4:'
const KEY_WALLET_ACCOUNTS = KEY_UNIQUE_PREFIX + 'wallet:accounts_v2'
const KEY_WALLET_TOKENS = KEY_UNIQUE_PREFIX + 'wallet:tokens_v2'
const KEY_ACTIVE_ACCOUNT_ID = KEY_UNIQUE_PREFIX + 'wallet:active_account_id_v2'

const ACCOUNT_ID_REGEX = /^[a-z0-9@._-]{5,32}$/

export class Wallet {
   constructor() {
      this.key_store = new nearlib.BrowserLocalStorageKeystore()
      this.near = nearlib.Near.createDefaultConfig(NODE_URL)
      this.account = new nearlib.Account(this.near.nearClient)
      this.accounts = JSON.parse(
         localStorage.getItem(KEY_WALLET_ACCOUNTS) || '{}'
      )
      this.tokens = JSON.parse(localStorage.getItem(KEY_WALLET_TOKENS) || '{}')
      this.accountId = localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID) || ''
   }

   save() {
      localStorage.setItem(KEY_ACTIVE_ACCOUNT_ID, this.accountId)
      localStorage.setItem(KEY_WALLET_ACCOUNTS, JSON.stringify(this.accounts))
      localStorage.setItem(KEY_WALLET_TOKENS, JSON.stringify(this.tokens))
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

   newAccessToken(app_url, app_title, contract_id) {
      var token = ''
      var possible =
         'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

      for (var i = 0; i < 32; i++) {
         token += possible.charAt(Math.floor(Math.random() * possible.length))
      }

      if (!this.isLegitAccountId(contract_id)) {
         contract_id = ''
      }

      this.tokens[token] = {
         app_url,
         app_title,
         contract_id,
         account_id: this.accountId
      }
      this.save()
      return token
   }

   isLegitAccountId(accountId) {
      return ACCOUNT_ID_REGEX.test(accountId)
   }

   async sendTransaction(senderId, receiverId, methodName, amount, args) {
      return await this.near.scheduleFunctionCall(
         amount,
         senderId,
         receiverId,
         methodName,
         args || {}
      )
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
      // return await this.account.getAccountDetails(this.accountId)

      return {
         authorizedApps: [
            {
               contractId: 'studio-znshwhk6i',
               amount: 100,
               publicKey: '85Th4x9hCpgQ5vFZbMZ76RhsQpyAFeMsnnouxMbNfCKS'
            },
            {
               contractId: 'studio-ee4arncdv',
               amount: 200,
               publicKey: 'DcXCBrXq77PHEuMVLChshGPtUCfUEjJHGuZ9hHos6VEp'
            },
            {
               contractId: 'studio-znshwhk6i',
               amount: 100,
               publicKey: '85Th4x9hCpgQ5vFZbMZ76RhsQpyAFeMsnnouxMbNfCKS'
            },
            {
               contractId: 'studio-ee4arncdv',
               amount: 200,
               publicKey: 'DcXCBrXq77PHEuMVLChshGPtUCfUEjJHGuZ9hHos6VEp'
            },
            {
               contractId: 'studio-znshwhk6i',
               amount: 100,
               publicKey: '85Th4x9hCpgQ5vFZbMZ76RhsQpyAFeMsnnouxMbNfCKS'
            },
            {
               contractId: 'studio-ee4arncdv',
               amount: 200,
               publicKey: 'DcXCBrXq77PHEuMVLChshGPtUCfUEjJHGuZ9hHos6VEp'
            },
            {
               contractId: 'studio-znshwhk6i',
               amount: 100,
               publicKey: '85Th4x9hCpgQ5vFZbMZ76RhsQpyAFeMsnnouxMbNfCKS'
            },
            {
               contractId: 'studio-ee4arncdv',
               amount: 200,
               publicKey: 'DcXCBrXq77PHEuMVLChshGPtUCfUEjJHGuZ9hHos6VEp'
            }
         ],
         transactions: []
      }
   }

   async removeAccessKey(publicKey) {
      return await this.account.getAccountDetails(this.accountId, publicKey)
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
               this.key_store.setKey(accountId, keyPair).catch(console.log)
               this.accounts[accountId] = true
               this.accountId = accountId
               this.save()
               resolve(xhr)
            } else if (xhr.status !== 200) {
               reject(xhr.responseText)
            }
         }
         xhr.send(data)
      })
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
         const result = await this.near.waitForTransactionResult(
            addAccessKeyResponse
         )
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

   subscribeForMessages() {
      //  window.addEventListener("message", $.proxy(this.receiveMessage, this), false);
      window.addEventListener('message', this.receiveMessage.bind(this), false)
   }

   clearState() {
      this.accounts = {}
      this.tokens = {}
      this.accountId = ''
      this.save()
   }

   async processTransactionMessage(action, data) {
      let token = data['token'] || ''
      if (!(token in this.tokens)) {
         // Unknown token.
         throw new Error('The token ' + token + ' is not found ')
      }
      let app_data = this.tokens[token]
      let accountId = app_data['account_id']
      if (!(accountId in this.accounts)) {
         // Account is no longer authorized.
         throw new Error(
            'The account ' + accountId + ' is not part of the wallet anymore.'
         )
      }
      let contract_id = app_data['contract_id']
      let receiverId = data['receiver_id'] || contract_id
      if (receiverId !== contract_id || !this.isLegitAccountId(receiverId)) {
         // Bad receiver account ID or it doesn't match contract id.
         throw new Error(
            "Bad receiver's account ID ('" +
               receiverId +
               "') or it doesn't match the authorized contract id"
         )
      }
      let amount = parseInt(data['amount']) || 0
      if (amount !== 0) {
         // Automatic authorization denied since for amounts greater than 0.
         throw new Error('Transaction amount should be 0.')
      }
      let methodName = data['methodName'] || ''
      if (!methodName) {
         // Method name can't be empty since the amount is 0.
         throw new Error("Method name can't be empty since the amount is 0")
      }
      let args = data['args'] || {}
      if (action === 'send_transaction') {
         // Sending the transaction on behalf of the accountId
         return await this.sendTransaction(
            accountId,
            receiverId,
            methodName,
            amount,
            args
         )
      } else if (action === 'sign_transaction') {
         // Signing the provided hash of the transaction. It's a security issue here.
         // In the future we would sign the transaction above and don't depend on the given hash.
         let hash = data['hash'] || ''
         let signature = await this.near.nearClient.signer.signHash(
            hash,
            accountId
         )
         return signature
      } else {
         throw new Error('Unknown action')
      }
   }

   requestCode(phoneNumber, accountId) {
      return sendJson(
         'POST',
         `${ACCOUNT_HELPER_URL}/account/${phoneNumber}/${accountId}/requestCode`
      )
   }

   async validateCode(phoneNumber, accountId, securityCode) {
      const key = this.key_store.getKey(accountId)
      const signer = new nearlib.SimpleKeyStoreSigner(this.key_store)
      const { signature } = key
         ? signer.signBuffer(Buffer.from(securityCode), accountId)
         : undefined
      return sendJson(
         'POST',
         `${ACCOUNT_HELPER_URL}/account/${phoneNumber}/${accountId}/validateCode`,
         { securityCode, signature }
      )
   }

   receiveMessage(event) {
      let data
      try {
         data = JSON.parse(event.data)
      } catch (e) {
         // Silently dying.
         return
      }
      const action = data['action'] || ''
      if (action !== 'send_transaction' && action !== 'sign_transaction') {
         // Unknown action, skipping silently.
         return
      }
      const request_id = data['request_id'] || ''

      let reply = d => event.source.postMessage(JSON.stringify(d), event.origin)

      this.processTransactionMessage(action, data)
         .then(result => {
            console.log('Wallet: OK ' + action)
            reply({
               success: true,
               request_id,
               result
            })
         })
         .catch(error => {
            console.error('Wallet: failed to ' + action, error)
            reply({
               success: false,
               request_id,
               error
            })
         })
   }
}
