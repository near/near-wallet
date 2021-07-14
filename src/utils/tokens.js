
import * as Sentry from '@sentry/browser';

import sendJson from '../tmp_fetch_send_json';
import { ACCOUNT_HELPER_URL } from './wallet';
import { wallet } from './wallet';

export const getLikelyTokenContracts = (accountId) => (
    sendJson('GET', `${ACCOUNT_HELPER_URL}/account/${accountId}/likelyTokens`).catch(logError)
);

export const getMetadata = async (contractName, accountId) => {
    const account = wallet.getAccountBasic(accountId);
    
    // FungibleTokenMetadata interface
    // https://github.com/near/NEPs/blob/master/specs/Standards/FungibleToken/Metadata.md
    const metadata = await account.viewFunction(contractName, 'ft_metadata').catch(logError);

    return {
        contractName,
        metadata
    };
};

export const getBalanceOf = async (contractName, accountId) => {
    const account = wallet.getAccountBasic(accountId);
    const balance = await account.viewFunction(contractName, 'ft_balance_of', { account_id: accountId }).catch(logError);
    return {
        contractName,
        balance
    };
};

const logError = (error) => {
    console.warn(error);
    Sentry.captureException(error);
};
