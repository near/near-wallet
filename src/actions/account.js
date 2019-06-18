import { parse, stringify } from 'query-string'
import { createActions } from 'redux-actions'
import { Wallet } from '../utils/wallet'

export const REFRESH_ACCOUNT = 'REFRESH_ACCOUNT'
export const LOADER_ACCOUNT = 'LOADER_ACCOUNT'
export const REFRESH_URL = 'REFRESH_URL'

export function handleRefreshAccount(wallet, history) {
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

            if (e.message && e.message.indexOf('doesn\'t exist') !== -1) {
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
      dispatch({
         type: REFRESH_URL,
         url: {
            app_title: parse(location.search).title || '',
            app_url: parse(location.search).app_url || '',
            contract_id: parse(location.search).contract_id || '',
            success_url: parse(location.search).success_url || '',
            failure_url: parse(location.search).failure_url || '',
            public_key: parse(location.search).public_key || ''
         }
      })
   }
}

const wallet = new Wallet()

export const redirectToApp = () => (dispatch, getState) => {
   const state = getState()
   const nextUrl = (state.account.url && state.account.url.success_url) ? `/login/?${stringify(state.account.url)}` : '/'
   setTimeout(() => {
      window.location = nextUrl
   }, 1500)
}

export const { requestCode, setupAccountRecovery, recoverAccount, getAccountDetails, removeAccessKey } = createActions({
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
})
