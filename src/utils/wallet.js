import nearlib from 'nearlib'

const WALLET_URL = `/login/`
const WALLET_CREATE_NEW_ACCOUNT_URL = `/create/`

const CONTRACT_CREATE_ACCOUNT_URL =
   'https://studio.nearprotocol.com/contract-api/account'
const NODE_URL = 'https://studio.nearprotocol.com/devnet'

const KEY_UNIQUE_PREFIX = '_4:'
const KEY_WALLET_ACCOUNTS = KEY_UNIQUE_PREFIX + 'wallet:accounts_v2'
const KEY_WALLET_TOKENS = KEY_UNIQUE_PREFIX + 'wallet:tokens_v2'
const KEY_ACTIVE_ACCOUNT_ID = KEY_UNIQUE_PREFIX + 'wallet:active_account_id_v2'

const ACCOUNT_ID_REGEX = /^[a-z0-9@._\-]{5,32}$/

function sleep(time) {
   return new Promise(function(resolve, reject) {
      setTimeout(resolve, time)
   })
}

export class Wallet {
   constructor() {
      this.key_store = new nearlib.BrowserLocalStorageKeystore()
      this.near = nearlib.Near.createDefaultConfig(NODE_URL)
      this.accounts = JSON.parse(
         localStorage.getItem(KEY_WALLET_ACCOUNTS) || '{}'
      )
      this.tokens = JSON.parse(localStorage.getItem(KEY_WALLET_TOKENS) || '{}')
      this.account_id = localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID) || ''
      //  $('body').append(
      //    $('<div/>').addClass("container").attr('role', 'footer').css('margin-top', '50px').append(
      //      $('<div/>').append(
      //        $("<small/>").addClass("text-muted").text("DISCLAIMER: This is a developers' preview Wallet. It should be used for NEAR Protocol DevNet only. Learn more at ").append(
      //          $("<a/>").attr("href", "https://nearprotocol.com").text("nearprotocol.com")
      //        )
      //      )
      //    )
      //  );
   }

   save() {
      localStorage.setItem(KEY_ACTIVE_ACCOUNT_ID, this.account_id)
      localStorage.setItem(KEY_WALLET_ACCOUNTS, JSON.stringify(this.accounts))
      localStorage.setItem(KEY_WALLET_TOKENS, JSON.stringify(this.tokens))
   }

   get_account_id() {
      return this.account_id
   }

   select_account(account_id) {
      if (!(account_id in this.accounts)) {
         return false
      }
      this.account_id = account_id
      this.save()
   }

   new_access_token(app_url, app_title, contract_id) {
      var token = ''
      var possible =
         'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

      for (var i = 0; i < 32; i++) {
         token += possible.charAt(Math.floor(Math.random() * possible.length))
      }

      if (!this.is_legit_account_id(contract_id)) {
         contract_id = ''
      }

      this.tokens[token] = {
         app_url,
         app_title,
         contract_id,
         account_id: this.account_id
      }
      this.save()
      return token
   }

   is_legit_account_id(account_id) {
      return ACCOUNT_ID_REGEX.test(account_id)
   }

   async send_transaction(sender_id, receiver_id, method_name, amount, args) {
      return await this.near.scheduleFunctionCall(
         amount,
         sender_id,
         receiver_id,
         method_name,
         args || {}
      )
   }

   redirect_to_create_account(options = {}, history) {
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

   is_empty() {
      return !this.accounts || !Object.keys(this.accounts).length
   }

   redirect_if_empty(history) {
      if (this.is_empty()) {
         this.redirect_to_create_account({}, history)
      }
   }

   async load_account(account_id, history) {
      if (!(account_id in this.accounts)) {
         throw 'Account ' + account_id + " doesn't exists."
      }
      try {
         return await this.near.nearClient.viewAccount(account_id)
      } catch (e) {
         if (e.message && e.message.indexOf('is not valid') != -1) {
            // We have an account in the storage, but it doesn't exist on blockchain. We probably nuked storage so just redirect to create account
            console.log(e)
            this.clear_state()
            this.redirect_to_create_account(
               {
                  reset_accounts: true
               },
               history
            )
         }
      }
   }

   async create_new_account(account_id) {
      if (account_id in this.accounts) {
         throw 'Account ' + account_id + ' already exists.'
      }
      let remoteAccount = null
      try {
         remoteAccount = await this.near.nearClient.viewAccount(account_id)
      } catch (e) {
         // expected
      }
      if (!!remoteAccount) {
         throw 'Account ' + account_id + ' already exists.'
      }
      let keyPair = await nearlib.KeyPair.fromRandomSeed()
      return await new Promise((resolve, reject) => {
         let data = JSON.stringify({
            newAccountId: account_id,
            newAccountPublicKey: keyPair.getPublicKey()
         })

         // $.post(CONTRACT_CREATE_ACCOUNT_URL, data)
         //   .done((d) => {
         //     this.key_store.setKey(account_id, keyPair).catch(console.log);
         //     this.accounts[account_id] = true;
         //     this.account_id = account_id;
         //     this.save();
         //     resolve(d);
         //   })
         //   .fail((e) => {
         //     reject(e.responseText)
         //   })

         var xhr = new XMLHttpRequest()
         xhr.open('POST', CONTRACT_CREATE_ACCOUNT_URL)
         xhr.setRequestHeader('Content-Type', 'application/json')
         xhr.onload = () => {
            if (xhr.status === 200) {
               this.key_store.setKey(account_id, keyPair).catch(console.log)
               this.accounts[account_id] = true
               this.account_id = account_id
               this.save()
               resolve(xhr)
            } else if (xhr.status !== 200) {
               reject(xhr.responseText)
            }
         }
         xhr.send(data)
      })
   }

   subscribe_for_messages() {
      //  window.addEventListener("message", $.proxy(this.receive_message, this), false);
      window.addEventListener('message', this.receive_message.bind(this), false)
   }

   clear_state() {
      this.accounts = {}
      this.tokens = {}
      this.account_id = ''
      this.save()
   }

   async process_transaction_message(action, data) {
      let token = data['token'] || ''
      if (!(token in this.tokens)) {
         // Unknown token.
         throw 'The token ' + token + ' is not found '
      }
      let app_data = this.tokens[token]
      let account_id = app_data['account_id']
      if (!(account_id in this.accounts)) {
         // Account is no longer authorized.
         throw 'The account ' +
            account_id +
            ' is not part of the wallet anymore.'
      }
      let contract_id = app_data['contract_id']
      let receiver_id = data['receiver_id'] || contract_id
      if (
         receiver_id !== contract_id ||
         !this.is_legit_account_id(receiver_id)
      ) {
         // Bad receiver account ID or it doesn't match contract id.
         throw "Bad receiver's account ID ('" +
            receiver_id +
            "') or it doesn't match the authorized contract id"
      }
      let amount = parseInt(data['amount']) || 0
      if (amount !== 0) {
         // Automatic authorization denied since for amounts greater than 0.
         throw 'Transaction amount should be 0.'
      }
      let method_name = data['method_name'] || ''
      if (!method_name) {
         // Method name can't be empty since the amount is 0.
         throw "Method name can't be empty since the amount is 0"
      }
      let args = data['args'] || {}
      if (action == 'send_transaction') {
         // Sending the transaction on behalf of the account_id
         return await this.send_transaction(
            account_id,
            receiver_id,
            method_name,
            amount,
            args
         )
      } else if (action == 'sign_transaction') {
         // Signing the provided hash of the transaction. It's a security issue here.
         // In the future we would sign the transaction above and don't depend on the given hash.
         let hash = data['hash'] || ''
         let signature = await this.near.nearClient.signer.signHash(
            hash,
            account_id
         )
         return signature
      } else {
         throw 'Unknown action'
      }
   }

   receive_message(event) {
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

      this.process_transaction_message(action, data)
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
