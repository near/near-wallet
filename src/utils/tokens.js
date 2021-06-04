
import sendJson from '../tmp_fetch_send_json'
import { ACCOUNT_HELPER_URL } from './wallet'
import * as Sentry from '@sentry/browser'
import { wallet } from './wallet'

export const getLikelyContracts = async (accountId) => (
    await logAndIgnoreError(sendJson('GET', `${ACCOUNT_HELPER_URL}/account/${accountId}/likelyTokens`))
)

export const getMetadata = async (contractName, accountId) => {
    const account = await wallet.getAccountBasic(accountId)
    let metadata = await logAndIgnoreError(account.viewFunction(contractName, 'ft_metadata'))
    return {
        contractName,
        metadata
    }
}

export const getBalanceOf = async (contractName, accountId) => {
    const account = await wallet.getAccountBasic(accountId)
    let balance = await logAndIgnoreError(account.viewFunction(contractName, 'ft_balance_of', { account_id: accountId }))
    return {
        contractName,
        balance
    }
}

const logAndIgnoreError = (promise) => promise.catch(error => (console.warn(error), Sentry.captureException(error)));
