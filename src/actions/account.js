import { parse, stringify } from 'query-string'
import { createActions, createAction } from 'redux-actions'
import { Wallet } from '../utils/wallet'
import { getTransactions as getTransactionsApi } from '../utils/explorer-api'
import { push } from 'connected-react-router'

export const REFRESH_ACCOUNT = 'REFRESH_ACCOUNT'
export const LOADER_ACCOUNT = 'LOADER_ACCOUNT'
export const REFRESH_URL = 'REFRESH_URL'

export function handleRefreshAccount(history, loader = true) {
   return (dispatch, getState) => {
      if (loader) {
         dispatch({
            type: LOADER_ACCOUNT,
            loader: true
         })   
      }

      if (wallet.isEmpty()) {
         if (loader) {
            dispatch({
               type: LOADER_ACCOUNT,
               loader: false
            })   
         }

         return false
      }
      
      const accountId = wallet.getAccountId()

      wallet
         .loadAccount(accountId, history)
         .then(v => {
            dispatch({
               type: REFRESH_ACCOUNT,
               data: {
                  accountId: accountId,
                  amount: v['amount'] || 0,
                  stake: v['stake'],
                  nonce: v['nonce'],
                  code_hash: v['code_hash'],
                  accounts: wallet.accounts
               }
            })
         })
         .catch(e => {
            console.error('Error loading account:', e)

            if (e.message && e.message.indexOf('does not exist while viewing') !== -1) {
               // We have an account in the storage, but it doesn't exist on blockchain. We probably nuked storage so just redirect to create account
               // TODO: Offer to remove specific account vs clearing everything?
               wallet.clearState()               
               wallet.redirectToCreateAccount(
                  {
                     reset_accounts: true
                  },
                  history
               )
            }
         })
         .finally(() => {
            if (loader) {
               dispatch({
                  type: LOADER_ACCOUNT,
                  loader: false
               })
            }
         })
   }
}

export const parseTransactionsToSign = createAction('PARSE_TRANSACTIONS_TO_SIGN')

export function handleRefreshUrl(location) {
   return dispatch => {
      const { title, app_url, contract_id, success_url, failure_url, public_key, transactions, callback, account_id, send, redirect_url } = parse(location.search)
      dispatch({
         type: REFRESH_URL,
         url: {
            referrer: document.referrer,
            title: title || '',
            app_url: app_url || '',
            contract_id: contract_id || '',
            success_url: success_url || '',
            failure_url: failure_url || '',
            public_key: public_key || '',
            callback: callback || ``,
            account_id: account_id || '',
            send: send || '',
            redirect_url: redirect_url || '',
         }
      })

      if (transactions) {
         dispatch(parseTransactionsToSign(transactions))
      }
   }
}

const wallet = new Wallet()

export const redirectToApp = () => (dispatch, getState) => {
   const { account: { url }} = getState()
   dispatch(push({
      pathname: url.redirect_url || '/',
      search: (url && (url.success_url || url.public_key)) ? `?${stringify(url)}` : '',
      state: {
         globalAlertPreventClear: true
      }
   }))
}

export const allowLogin = () => async (dispatch, getState) => {
   const { account } = getState()
   const { url } = account
   const { error } = await dispatch(addAccessKey(account.accountId, url.contract_id, url.public_key, url.success_url, url.title))
   if (error) return

   const { success_url, public_key } = url
   if (success_url) {
      const availableKeys = await wallet.getAvailableKeys();
      const allKeys = availableKeys.map(key => key.toString());
      const parsedUrl = new URL(success_url)
      parsedUrl.searchParams.set('account_id', account.accountId)
      parsedUrl.searchParams.set('public_key', public_key)
      parsedUrl.searchParams.set('all_keys', allKeys.join(','))
      window.location = parsedUrl.href
   } else {
      await dispatch(push({ pathname: '/authorized-apps' }))
   }
}

const defaultCodesFor = (prefix, data) => ({ successCode: `${prefix}.success`, errorCode: `${prefix}.error`, data})

export const { requestCode, setupAccountRecovery, recoverAccount, checkNewAccount, createNewAccount, checkAccountAvailable, getTransactions, clear, clearCode } = createActions({
   REQUEST_CODE: [
      wallet.requestCode.bind(wallet),
      () => defaultCodesFor('account.requestCode')
   ],
   SETUP_ACCOUNT_RECOVERY: [
      wallet.setupAccountRecovery.bind(wallet),
      () => defaultCodesFor('account.setupAccountRecovery')
   ],
   RECOVER_ACCOUNT: [
      wallet.recoverAccount.bind(wallet),
      () => defaultCodesFor('account.recoverAccount')
   ],
   CHECK_NEW_ACCOUNT: [
      wallet.checkNewAccount.bind(wallet),
      () => defaultCodesFor('account.create')
   ],
   CREATE_NEW_ACCOUNT: [
      wallet.createNewAccount.bind(wallet),
      () => defaultCodesFor('account.create')
   ],
   CHECK_ACCOUNT_AVAILABLE: [
      wallet.checkAccountAvailable.bind(wallet),
      () => defaultCodesFor('account.available')
   ],
   GET_TRANSACTIONS: [getTransactionsApi.bind(wallet), () => ({})],
   CLEAR: null,
   CLEAR_CODE: null
})



export const { getAccessKeys, removeAccessKey, addLedgerAccessKey } = createActions({
   GET_ACCESS_KEYS: [wallet.getAccessKeys.bind(wallet), () => ({})],
   REMOVE_ACCESS_KEY: [wallet.removeAccessKey.bind(wallet), () => ({})],
   ADD_LEDGER_ACCESS_KEY: [wallet.addLedgerAccessKey.bind(wallet), () => ({})],
})

export const { addAccessKey, addAccessKeySeedPhrase, clearAlert } = createActions({
   ADD_ACCESS_KEY: [
      wallet.addAccessKey.bind(wallet),
      (accountId, contractId, publicKey, successUrl, title) => defaultCodesFor('account.login', {title})
   ],
   ADD_ACCESS_KEY_SEED_PHRASE: [
      wallet.addAccessKey.bind(wallet),
      () => defaultCodesFor('account.setupSeedPhrase')
   ],
   CLEAR_ALERT: null,
})

export const { recoverAccountSeedPhrase } = createActions({
   RECOVER_ACCOUNT_SEED_PHRASE: [
      wallet.recoverAccountSeedPhrase.bind(wallet),
      () => defaultCodesFor('account.recoverAccount')
   ],
})

export const { signAndSendTransactions } = createActions({
   SIGN_AND_SEND_TRANSACTIONS: [
      wallet.signAndSendTransactions.bind(wallet),
      () => defaultCodesFor('account.signAndSendTransactions')
   ]
})

export const { switchAccount } = createActions({
   SWITCH_ACCOUNT: wallet.selectAccount.bind(wallet)
})
