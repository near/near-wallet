import { parse, stringify } from 'query-string'
import { createActions } from 'redux-actions'
import { Wallet } from '../utils/wallet'

export const REFRESH_ACCOUNT = 'REFRESH_ACCOUNT'
export const LOADER_ACCOUNT = 'LOADER_ACCOUNT'
export const REFRESH_URL = 'REFRESH_URL'

export function handleRefreshAccount(history) {
   return (dispatch, getState) => {
      wallet.redirectIfEmpty(history)
      const accountId = wallet.getAccountId()

      dispatch(getAccountDetails())

      dispatch({
         type: LOADER_ACCOUNT,
         loader: true
      })

      wallet
         .loadAccount(accountId, history)
         .then(v => {
            dispatch({
               type: REFRESH_ACCOUNT,
               data: {
                  accountId: accountId,
                  amount: v['amount'] || 0,
                  amountStr: Number(v['amount']).toLocaleString('en', {useGrouping:true}) || '0',
                  stake: v['stake'],
                  nonce: v['nonce'],
                  code_hash: v['code_hash'],
                  accounts: wallet.accounts
               }
            })

            dispatch({
               type: LOADER_ACCOUNT,
               loader: false
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
   }
}

export function handleRefreshUrl(location) {
   return dispatch => {
      const { title, app_url, contract_id, success_url, failure_url, public_key  } = parse(location.search)
      let redirect_url = ''

      if (success_url) {
         const parsedUrl = new URL(success_url)
         parsedUrl.searchParams.set('account_id', wallet.getAccountId())
         parsedUrl.searchParams.set('public_key', public_key)
         redirect_url = parsedUrl.href
      }

      dispatch({
         type: REFRESH_URL,
         url: {
            title: title || '',
            app_url: app_url || '',
            contract_id: contract_id || '',
            success_url: success_url || '',
            failure_url: failure_url || '',
            public_key: public_key || '',
            redirect_url: redirect_url
         }
      })
   }
}

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
   CLEAR_CODE: null,
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
