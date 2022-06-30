import Environments from '../../../../features/environments.json';
import { IS_MAINNET, SHOW_PRERELEASE_WARNING, NEAR_WALLET_ENV } from '../config';
import { isWhitelabel } from '../config/whitelabel';

export const getNearOrgWalletUrl = (https = true) => {
    let networkName = '';

    if (SHOW_PRERELEASE_WARNING) {
        networkName = 'staging.';
    } else if (!IS_MAINNET) {
        networkName = 'testnet.';
    }

    return `${https ? 'https://' : ''}wallet.${networkName}near.org`;
};

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

export default isWhitelabel() ? getMyNearWalletUrl : getNearOrgWalletUrl;
