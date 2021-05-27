
import sendJson from '../tmp_fetch_send_json'
import { ACCOUNT_HELPER_URL } from './wallet'
import * as Sentry from '@sentry/browser'

export const getLikelyTokens = async (accountId) => {
    return await sendJson('GET', `${ACCOUNT_HELPER_URL}/account/${accountId}/likelyTokens`)
}

export const getMetadata = async (contract, account) => {
    let metadata

    try {
        metadata = await account.viewFunction(contract, 'ft_metadata')
    } catch (e) {
        logError(e);
    } finally {
        return {
            contract,
            metadata
        }
    }
}

export const getBalanceOf = async (contract, account, accountId) => {
    let balance

    try {
        balance = await account.viewFunction(contract, 'ft_balance_of', { account_id: accountId })
    } catch (e) {
        logError(e);
    } finally {
        return {
            contract,
            balance
        }
    }
}

const logError = (error) => {
    console.warn(error)
    Sentry.captureException()
};
