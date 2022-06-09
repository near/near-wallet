import Environments from '../../../../features/environments.json';
import environmentConfig from './configFromEnvironment';

const isWhitelabel = () => {
    const { NEAR_WALLET_ENV } = environmentConfig;

    return NEAR_WALLET_ENV === Environments.DEVELOPMENT ||
        NEAR_WALLET_ENV === Environments.TESTNET ||
        NEAR_WALLET_ENV === Environments.TESTNET_STAGING ||
        NEAR_WALLET_ENV === Environments.MAINNET ||
        NEAR_WALLET_ENV === Environments.MAINNET_STAGING;
};

module.exports = {
    isWhitelabel
};
