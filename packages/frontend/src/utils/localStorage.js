import { keyAccountConfirmed, keyStakingAccountSelected, keyAccountInactive, keyReleaseNotesModalClosed } from './wallet';

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

export const setAccountIsInactive = (accountId) => {
    localStorage.setItem(keyAccountInactive(accountId), true);
};

export const getAccountIsInactive = (accountId) => {
    return localStorage.getItem(keyAccountInactive(accountId));
};

export const removeAccountIsInactive = (accountId) => {
    localStorage.removeItem(keyAccountInactive(accountId));
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
