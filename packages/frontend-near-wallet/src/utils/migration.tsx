import Environments from '../../../../features/environments.json';
import { NEAR_WALLET_ENV, NETWORK_ID } from './config';

import * as nearApiJs from 'near-api-js';
const KEY_UNIQUE_PREFIX = '_4:';
const KEY_WALLET_ACCOUNTS = KEY_UNIQUE_PREFIX + 'wallet:accounts_v2';

const keyStore = new nearApiJs.keyStores.BrowserLocalStorageKeyStore(window.localStorage, 'nearlib:keystore:');


export const getAvailableAccounts = () => {
    const dataFromLocalStorage = JSON.parse(
        localStorage.getItem(KEY_WALLET_ACCOUNTS) || '{}'
    );
    return dataFromLocalStorage ? Object.keys(dataFromLocalStorage) : []
}

export const getLocalKeyPair = async (accountId: string) => {
    return keyStore.getKey(NETWORK_ID, accountId);
}


export const getLedgerHDPath = (accountId: string): string | null => {
    return localStorage.getItem(`ledgerHdPath:${accountId}`);
};

export const getMyNearWalletUrlFromNEARORG = (https = true) => {
    const prefix = {
        [Environments.TESTNET_NEARORG]: 'testnet.',
        [Environments.MAINNET_NEARORG]: 'app.',
        [Environments.DEVELOPMENT]: 'testnet.',
        [Environments.MAINNET_STAGING_NEARORG]: 'staging.'
    }[NEAR_WALLET_ENV];

    return `${https ? 'https://' : ''}${prefix || ''}mynearwallet.com`;
};
