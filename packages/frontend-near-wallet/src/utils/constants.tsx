import Environments from '../../../../features/environments.json';
// import IconLedger from '../assets/images/IconLedger';
import ImgMyNearWallet from '../assets/images/ImgMyNearWallet';
import { NEAR_WALLET_ENV } from './config';


// The goal here is to make adding a new migration destination simply a matter of adding more entries following this schema
export const WALLET_OPTIONS = [
    {
        id: 'my-near-wallet',
        name: 'My NEAR Wallet',
        icon: <ImgMyNearWallet />,
        URLS: {
            production: 'https://mynearwallet.org/',
            staging: 'https://staging.mynearwallet.org/',
        },
        routes: {
            sign: '/sign',
            login: '/login',
        }
    },
    // {
    //     id: 'ledger',
    //     name: 'Ledger',
    //     icon: <IconLedger />,
    // },
];


export const WALLET_MIGRATION_VIEWS = {
    MIGRATION_PROMPT: 'MIGRATION_PROMPT',
    SELECT_DESTINATION_WALLET: 'SELECT_DESTINATION_WALLET',
    MIGRATION_SECRET: 'MIGRATION_SECRET',
    MIGRATE_ACCOUNTS: 'MIGRATE_ACCOUNTS'

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

