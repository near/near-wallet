import { parse } from 'query-string'
import { createActions } from 'redux-actions';
import { Wallet } from '../utils/wallet';

export const REFRESH_ACCOUNT = 'REFRESH_ACCOUNT'
export const LOADER_ACCOUNT = 'LOADER_ACCOUNT'
export const REFRESH_URL = 'REFRESH_URL'

export function handleRefreshAccount(wallet, history) {
   return (dispatch, getState) => {
      wallet.redirectIfEmpty(history)
      const accountId = wallet.getAccountId()

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
                  authToken: wallet.newAccessToken(
                     getState().account.url.app_title,
                     getState().account.url.app_url,
                     getState().account.url.contract_id
                  ),
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
            console.log(e)

            if (e.message && e.message.indexOf('is not valid') !== -1) {
               // We have an account in the storage, but it doesn't exist on blockchain. We probably nuked storage so just redirect to create account
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

export const { requestCode, validateCode, addAccessKey } = createActions({
   REQUEST_CODE: [
      wallet.requestCode.bind(wallet),
      () => ({ successCode: 'account.requestCode.success', errorCode: 'account.requestCode.error' })
   ],
   VALIDATE_CODE: [
      wallet.validateCode.bind(wallet),
      () => ({ successCode: 'account.validateCode.success', errorCode: 'account.validateCode.error' })
   ],
   ADD_ACCESS_KEY: [
      wallet.addAccessKey.bind(wallet),
      () => ({ successCode: 'account.addAccessKey.success', errorCode: 'account.addAccessKey.error' })
   ],
})




