import Environments from '../../../../features/environments.json';
import { NEAR_WALLET_ENV } from './configFromEnvironment';

const isWhitelabel = NEAR_WALLET_ENV === Environments.DEVELOPMENT
    || NEAR_WALLET_ENV === Environments.TESTNET
    || NEAR_WALLET_ENV === Environments.TESTNET_STAGING
    || NEAR_WALLET_ENV === Environments.MAINNET
    || NEAR_WALLET_ENV === Environments.MAINNET_STAGING;

module.exports = {
    isWhitelabel
};
