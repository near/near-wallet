import { parse } from 'query-string'

export const REFRESH_ACCOUNT = 'REFRESH_ACCOUNT'
export const LOADER_ACCOUNT = 'LOADER_ACCOUNT'
export const REFRESH_URL = 'REFRESH_URL'

export function handleRefreshAccount(wallet, history) {
   return (dispatch, getState) => {
      wallet.redirect_if_empty(history)
      const account_id = wallet.get_account_id()

      dispatch({
         type: LOADER_ACCOUNT,
         loader: true
      })

      wallet
         .load_account(account_id, history)
         .then(v => {
            dispatch({
               type: REFRESH_ACCOUNT,
               data: {
                  account_id: account_id,
                  auth_token: wallet.new_access_token(
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
            failure_url: parse(location.search).failure_url || ''
         }
      })
   }
}
