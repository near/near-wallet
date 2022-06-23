import { keyAccountConfirmed, keyStakingAccountSelected, keyReleaseNotesModalClosed } from './wallet';

export const setAccountConfirmed = (accountId, confirmed) => {
    localStorage.setItem(keyAccountConfirmed(accountId), confirmed);
};

export const getAccountConfirmed = (accountId) => {
    return localStorage.getItem(keyAccountConfirmed(accountId)) === 'true';
};

export const removeAccountConfirmed = (accountId) => {
    localStorage.removeItem(keyAccountConfirmed(accountId));
};

export const setStakingAccountSelected = (accountId) => {
    localStorage.setItem(keyStakingAccountSelected(), accountId);
};
export const getStakingAccountSelected = () => {
    return localStorage.getItem(keyStakingAccountSelected());
};

export const setReleaseNotesClosed = (version) => {
    localStorage.setItem(keyReleaseNotesModalClosed(version), true);
};

export const getReleaseNotesClosed = (version) => {
    return localStorage.getItem(keyReleaseNotesModalClosed(version));
};

export const setLedgerHdPath = ({ accountId, path }) => {
    localStorage.setItem(`ledgerHdPath:${accountId}`, path);
};

export const setWalletAccounts = (walletAccountsKey, walletAccounts) => {
    localStorage.setItem(walletAccountsKey, JSON.stringify(walletAccounts));
};

export const removeActiveAccount = (activeAccountKey) => {
    localStorage.removeItem(activeAccountKey);
};

export const getLedgerHDPath = (accountId) => {
    return localStorage.getItem(`ledgerHdPath:${accountId}`);
};

export const removeLedgerHDPath = (accountId) => {
    localStorage.removeItem(`ledgerHdPath:${accountId}`);
};
