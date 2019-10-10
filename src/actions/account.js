import { parse, stringify } from 'query-string'
import { createActions } from 'redux-actions'
import { Wallet } from '../utils/wallet'

const wallet = new Wallet()

export const redirectToApp = () => (dispatch, getState) => {
   const state = getState()
   const nextUrl = (state.account.url && (state.account.url.success_url || state.account.url.public_key)) ? `/login/?${stringify(state.account.url)}` : '/'
   
   setTimeout(() => {
      window.location = nextUrl
   }, 1500)
}

export const { requestCode, setupAccountRecovery, recoverAccount, getAccountDetails, removeAccessKey, checkNewAccount, createNewAccount, checkAccountAvailable, clear, clearCode } = createActions({
   REQUEST_CODE: [
      wallet.requestCode.bind(wallet),
      () => ({ successCode: 'account.requestCode.success', errorCode: 'account.requestCode.error' })
   ],
   SETUP_ACCOUNT_RECOVERY: [
      wallet.setupAccountRecovery.bind(wallet),
      () => ({ successCode: 'account.setupAccountRecovery.success', errorCode: 'account.setupAccountRecovery.error' })
   ],
   RECOVER_ACCOUNT: [
      wallet.recoverAccount.bind(wallet),
      () => ({ successCode: 'account.recoverAccount.success', errorCode: 'account.recoverAccount.error' })
   ],
   GET_ACCOUNT_DETAILS: [wallet.getAccountDetails.bind(wallet), () => ({})],
   REMOVE_ACCESS_KEY: [wallet.removeAccessKey.bind(wallet), () => ({})],
   CHECK_NEW_ACCOUNT: [
      wallet.checkNewAccount.bind(wallet),
      () => ({ successCode: 'Congrats! this name is available.', errorCode: 'Username is taken. Try something else.' })
   ],
   CREATE_NEW_ACCOUNT: [
      wallet.createNewAccount.bind(wallet),
      () => ({ successCode: 'Congrats! this name is available.', errorCode: 'Username is taken. Try something else.' })
   ],
   CHECK_ACCOUNT_AVAILABLE: [
      wallet.checkAccountAvailable.bind(wallet),
      () => ({ successCode: 'User found.', errorCode: 'User not found.' })
   ],
   CLEAR: null,
   CLEAR_CODE: null
})

export const { addAccessKey, clearAlert } = createActions({
   ADD_ACCESS_KEY: [
      wallet.addAccessKey.bind(wallet),
      (accountId, contractId, publicKey, successUrl, title) => ({
         successCodeHeader: 'Success',
         successCodeDescription: title + ' is now authorized to use your account.',
         errorCodeHeader: 'Error',
         errorCodeDescription: '' 
      })
   ],
   CLEAR_ALERT: null,
})

export const { switchAccount } = createActions({
   SWITCH_ACCOUNT: wallet.selectAccount.bind(wallet)
})

export const { refreshAccount, refreshUrl, resetAccounts } = createActions({
   REFRESH_ACCOUNT: [
      wallet.loadAccount.bind(wallet),
      (loader) => ({ 
         loader,
         accountId: wallet.getAccountId(),
         accounts: wallet.accounts
      })
   ],
   REFRESH_URL: ({ search }) => {
      const { title, app_url, contract_id, success_url, failure_url, public_key, transaction, callback, account_id, send } = parse(search)

      return {
         title: title || '',
         app_url: app_url || '',
         contract_id: contract_id || '',
         success_url: success_url || '',
         failure_url: failure_url || '',
         public_key: public_key || '',
         transaction: transaction || '',
         callback: callback || ``,
         account_id: account_id || '',
         send: send || '',
   }},
   RESET_ACCOUNTS: wallet.clearState.bind(wallet)
})
