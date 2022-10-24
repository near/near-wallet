import Environments from '../../../../features/environments.json';
import { NEAR_WALLET_ENV } from '../config';

export const getMyNearWalletUrl = (https = true) => {
    const prefix = {
        [Environments.TESTNET]: 'testnet.',
        [Environments.MAINNET]: 'app.',
        [Environments.DEVELOPMENT]: 'testnet.',
        [Environments.MAINNET_STAGING]: 'staging.'
    }[NEAR_WALLET_ENV];

    return `${https ? 'https://' : ''}${prefix || ''}mynearwallet.com`;
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

export const getMeteorWalletUrl = () => {
    return 'https://wallet.meteorwallet.app';
};

export default getMyNearWalletUrl;
