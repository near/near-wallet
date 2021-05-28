
import sendJson from '../tmp_fetch_send_json'
import { ACCOUNT_HELPER_URL } from './wallet'
import * as Sentry from '@sentry/browser'
import { wallet } from './wallet'

export const getLikelyContracts = async (accountId) => (
    await logAndIgnoreError(sendJson('GET', `${ACCOUNT_HELPER_URL}/account/${accountId}/likelyTokens`))
)

export const getMetadata = async (contract, accountId) => {
    const account = await wallet.getAccountBasic(accountId)

    let metadata = await logAndIgnoreError(account.viewFunction(contract, 'ft_metadata'))
    return {
        contract,
        metadata
    }
}

export const getBalanceOf = async (contract, accountId) => {
    const account = await wallet.getAccountBasic(accountId)

    let balance = await logAndIgnoreError(account.viewFunction(contract, 'ft_balance_of', { account_id: accountId }))
    return {
        contract,
        balance
    }
}

const logAndIgnoreError = (promise) => promise.catch(error => (console.warn(error), Sentry.captureException(error)));
