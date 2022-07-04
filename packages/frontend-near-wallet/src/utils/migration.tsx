


import React from 'react';
import IconLedger from '../assets/images/IconLedger';
import IconMyNearWallet from '../assets/favicon.svg';


export const getAvailableAccounts = () => {
    const dataFromLocalStorage = localStorage.getItem('_4:wallet:accounts_v2');
    return dataFromLocalStorage ? JSON.parse(dataFromLocalStorage) : []
}

export const getExportQueryFromAccounts = () => {
    const localAccountStore = getAvailableAccounts()
    const accounts: string[] = localAccountStore ? Object.keys(localAccountStore) : []
    let keys = [];
    let ledgerHdPaths = [];
    let accountStringEncodes = [];

    accounts.forEach((accountId) => {
        const accountKey = localStorage.getItem(`nearlib:keystore:${accountId}:default`);
        const ledgerHdPath = localStorage.getItem(`ledgerHdPath:${accountId}`);


        if (accountKey && !keys.includes(accountKey)) {
            keys.push(accountKey);
        }

        if (ledgerHdPath && !ledgerHdPaths.includes(ledgerHdPath)) {
            ledgerHdPaths.push(ledgerHdPath);
        }

        const keyIndex = keys.indexOf(accountKey);
        const ledgerPathIndex = ledgerHdPaths.indexOf(ledgerHdPath) == -1 ? 0 : ledgerHdPaths.indexOf(ledgerHdPath);
        let accountStringEncode = `${accountId}*${keyIndex}*${ledgerPathIndex}`;
        accountStringEncodes.push(accountStringEncode);
    });

    const stringifiedQuery = `keys=${keys.join(',')}&ledgerHdPaths=${ledgerHdPaths.join(',')}&accounts=${accountStringEncodes.join(',')}`;
    return stringifiedQuery;
};

export const WALLET_OPTIONS = [
    {
        id: 'my-near-wallet',
        name: 'My NEAR Wallet',
        icon: <img src={IconMyNearWallet} alt="MyNEARWallet Logo" />,
    },
    {
        id: 'ledger',
        name: 'Ledger',
        icon: <IconLedger />,
    },
];

