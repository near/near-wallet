import { DEVELOPMENT, TESTNET, TESTNET_STAGING, MAINNET, MAINNET_STAGING  } from '../../../../features/environments.json';
import { NEAR_WALLET_ENV } from './configFromEnvironment';

const isWhitelabel = NEAR_WALLET_ENV === DEVELOPMENT
    || NEAR_WALLET_ENV === TESTNET
    || NEAR_WALLET_ENV === TESTNET_STAGING
    || NEAR_WALLET_ENV === MAINNET
    || NEAR_WALLET_ENV === MAINNET_STAGING;

module.exports = {
    isWhitelabel
};
