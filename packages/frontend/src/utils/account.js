import { IMPLICINT_ACCOUNT_MAX_LENGTH } from './constants';

export const validateEmail = (email) => {
    /* Checks for anystring@anystring.anystring */
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const isImplicitAccount = (accountId) =>
    accountId && accountId.length === IMPLICINT_ACCOUNT_MAX_LENGTH && !accountId.includes('.');

const ACCOUNT_ID_SEPARATOR = '...';

export const shortenAccountId = (id, startChars = 8, endChars = 8) => {
    const numOfRemainingChars = startChars + endChars + ACCOUNT_ID_SEPARATOR.length;
    const isOutOfScope = id.length < numOfRemainingChars || numOfRemainingChars > IMPLICINT_ACCOUNT_MAX_LENGTH;
    const isPartMissing = startChars < 1 || endChars < 1;

    if (!isImplicitAccount(id) || isOutOfScope || isPartMissing) {
        return id;
    }

    return `${id.slice(0, startChars)}${ACCOUNT_ID_SEPARATOR}${id.slice(id.length - endChars)}`;
};
