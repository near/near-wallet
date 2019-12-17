import * as nearlib from 'nearlib'
import sendJson from 'fetch-send-json'
import sha256 from 'js-sha256';
import { findSeedPhraseKey } from './seed-phrase'
import { createClient } from 'near-ledger-js'
import { PublicKey } from 'nearlib/lib/utils'
import { KeyType } from 'nearlib/lib/utils/key_pair'
import { store } from '..'
import { getAccessKeys } from '../actions/account'

const WALLET_CREATE_NEW_ACCOUNT_URL = `/create/`

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID || 'default'
const ACCOUNT_HELPER_URL = process.env.REACT_APP_ACCOUNT_HELPER_URL || 'https://near-contract-helper.onrender.com'
const CONTRACT_CREATE_ACCOUNT_URL = `${ACCOUNT_HELPER_URL}/account`
const NODE_URL = process.env.REACT_APP_NODE_URL || 'https://rpc.nearprotocol.com'
const HELPER_KEY = process.env.REACT_APP_ACCOUNT_HELPER_KEY || '22skMptHjFWNyuEWY22ftn2AbLPSYpmYwGJRGwpNHbTV'

const KEY_UNIQUE_PREFIX = '_4:'
const KEY_WALLET_ACCOUNTS = KEY_UNIQUE_PREFIX + 'wallet:accounts_v2'
const KEY_ACTIVE_ACCOUNT_ID = KEY_UNIQUE_PREFIX + 'wallet:active_account_id_v2'
const ACCESS_KEY_FUNDING_AMOUNT = process.env.REACT_APP_ACCESS_KEY_FUNDING_AMOUNT || '100000000'

const ACCOUNT_ID_REGEX = /^(([a-z\d]+[-_])*[a-z\d]+[.@])*([a-z\d]+[-_])*[a-z\d]+$/

export const ACCOUNT_ID_SUFFIX = process.env.REACT_APP_ACCOUNT_ID_SUFFIX || '.test'

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

export class Wallet {
   constructor() {
      this.key_store = new nearlib.keyStores.BrowserLocalStorageKeyStore()
      const inMemorySigner = new nearlib.InMemorySigner(this.key_store)

      async function getLedgerKey(accountId) {
         let state = store.getState()
         if (!state.account.fullAccessKeys) {
            await store.dispatch(getAccessKeys(accountId))
            state = store.getState()
         }
         const accessKeys = state.account.fullAccessKeys
         if (accessKeys && state.account.accountId === accountId) {
            // TODO: Only use Ledger when it's the only available signer for given tx
            // TODO: Use network ID
            const ledgerKey = accessKeys.find(accessKey => accessKey.meta.type === 'ledger')
            if (ledgerKey) {
               return PublicKey.from(ledgerKey.public_key)
            }
         }
         return null
      }

      this.signer = {
         async getPublicKey(accountId, networkId) {
            return (await getLedgerKey(accountId)) || (await inMemorySigner.getPublicKey(accountId, networkId))
         },
         async signHash(hash, accountId, networkId) {
            throw new Error('signHash not implemented on Ledger yet')
         },
         async signMessage(message, accountId, networkId) {
            if (await getLedgerKey(accountId)) {
               // TODO: Use network ID
               const client = await createClient()
               const signature = await client.sign(message)
               return {
                  signature,
                  publicKey: await this.getPublicKey(accountId, networkId)
               }
            }
         }
      }
      this.connection = nearlib.Connection.fromConfig({
         networkId: NETWORK_ID,
         provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
         signer: this.signer
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

   // TODO: Figure out whether wallet should work with any account or current one. Maybe make wallet account specific and switch whole Wallet?
   async getAccessKeys() {
      if (!this.accountId) return null

      const accessKeys =  await this.getAccount(this.accountId).getAccessKeys()
      return Promise.all(accessKeys.map(async (accessKey) => ({
         ...accessKey,
         meta: await getKeyMeta(accessKey.public_key)
      })))
   }

   async removeAccessKey(publicKey) {
      return await this.getAccount(this.accountId).deleteKey(publicKey)
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
         if (!accountId.endsWith(ACCOUNT_ID_SUFFIX)) {
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

   async createNewAccount(accountId) {
      this.checkNewAccount(accountId)

      const keyPair = nearlib.KeyPair.fromRandom('ed25519')
      await sendJson('POST', CONTRACT_CREATE_ACCOUNT_URL, {
         newAccountId: accountId,
         newAccountPublicKey: keyPair.publicKey.toString()
      })
      await this.saveAndSelectAccount(accountId, keyPair);
   }

   async saveAndSelectAccount(accountId, keyPair) {
      await this.key_store.setKey(NETWORK_ID, accountId, keyPair)
      this.accounts[accountId] = true
      this.accountId = accountId
      this.save()
   }

   async addAccessKey(accountId, contractId, publicKey) {
      return await this.getAccount(accountId).addKey(
         publicKey,
         contractId,
         '', // methodName
         ACCESS_KEY_FUNDING_AMOUNT
      )
   }

   async addLedgerAccessKey(accountId) {
      const client = await createClient()
      window.client = client
      const rawPublicKey = await client.getPublicKey()
      const publicKey = new PublicKey(KeyType.ED25519, rawPublicKey)
      await setKeyMeta(publicKey, { type: 'ledger' })
      return await this.getAccount(accountId).addKey(publicKey)  
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
      const accountKeys = await account.getAccessKeys();
      if (!accountKeys.some(it => it.public_key.endsWith(HELPER_KEY))) {
         await account.addKey(HELPER_KEY);
      }

      const hash =  Uint8Array.from(sha256.array(Buffer.from(securityCode)));
      const { signature } = await this.connection.signer.signHash(hash, accountId, NETWORK_ID)
      await this.validateCode(phoneNumber, accountId, { securityCode, signature: Buffer.from(signature).toString('base64') })
   }

   async recoverAccount(phoneNumber, accountId, securityCode) {
      const keyPair = nearlib.KeyPair.fromRandom('ed25519')
      await this.validateCode(phoneNumber, accountId, { securityCode, publicKey: keyPair.publicKey.toString() })
      await this.saveAndSelectAccount(accountId, keyPair)
   }

   async recoverAccountSeedPhrase(seedPhrase, accountId) {
      const account = this.getAccount(accountId)
      const accessKeys = await account.getAccessKeys()
      const publicKeys = accessKeys.map(it => it.public_key)
      const { secretKey } = findSeedPhraseKey(seedPhrase, publicKeys)
      if (!secretKey) {
         throw new Error(`Cannot find matching public key for account ${accountId}`);
      }

      const keyPair = nearlib.KeyPair.fromString(secretKey)
      await this.saveAndSelectAccount(accountId, keyPair)
   }

   async signAndSendTransactions(transactions, accountId) {
      for (let { receiverId, nonce, blockHash, actions } of transactions) {
         const [, signedTransaction] = await nearlib.transactions.signTransaction(receiverId, nonce, actions, blockHash, this.connection.signer, accountId, NETWORK_ID)
         await this.connection.provider.sendTransaction(signedTransaction)
      }
   }
}
