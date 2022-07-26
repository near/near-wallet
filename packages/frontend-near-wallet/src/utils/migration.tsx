import Environments from '../../../../features/environments.json';
import { IS_MAINNET, SHOW_PRERELEASE_WARNING, NEAR_WALLET_ENV } from './config';


export const getAvailableAccounts = () => {
    const dataFromLocalStorage = localStorage.getItem('_4:wallet:accounts_v2');
    return dataFromLocalStorage ? Object.keys(JSON.parse(dataFromLocalStorage)) : []
}


export const getLedgerHDPath = (accountId) => {
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
