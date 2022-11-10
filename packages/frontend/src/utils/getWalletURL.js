import CONFIG from '../config';
import ENVIRONMENT from '../config/enviroment';

export const getMyNearWalletUrl = (https = true) => {
    const prefix = {
        [ENVIRONMENT.TESTNET]: 'testnet.',
        [ENVIRONMENT.MAINNET]: 'app.',
        [ENVIRONMENT.DEVELOPMENT]: 'testnet.',
        [ENVIRONMENT.MAINNET_STAGING]: 'staging.'
    }[CONFIG.NEAR_WALLET_ENV];

    return `${https ? 'https://' : ''}${prefix || ''}mynearwallet.com`;
};

export const getMyNearWalletUrlFromNEARORG = (https = true) => {
    const prefix = {
        [ENVIRONMENT.TESTNET_NEARORG]: 'testnet.',
        [ENVIRONMENT.MAINNET_NEARORG]: 'app.',
        [ENVIRONMENT.DEVELOPMENT]: 'testnet.',
    }[CONFIG.NEAR_WALLET_ENV];

    return `${https ? 'https://' : ''}${prefix || ''}mynearwallet.com`;
};

export const getMeteorWalletUrl = () => {
    return 'https://wallet.meteorwallet.app';
};

export default getMyNearWalletUrl;
