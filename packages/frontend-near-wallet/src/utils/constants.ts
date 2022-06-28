import Environments from '../../../../features/environments.json';
import { NEAR_WALLET_ENV } from './config';

export const WALLET_MIGRATION_VIEWS = {
    MIGRATION_PROMPT: 'MIGRATION_PROMPT',
    SELECT_DESTINATION_WALLET: 'SELECT_DESTINATION_WALLET',
    GENERATE_MIGRATION_PIN: 'GENERATE_MIGRATION_PIN',
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