import { IMPLICINT_ACCOUNT_MAX_LENGTH } from './constants';

export const validateEmail = (email) => {
    /* Checks for anystring@anystring.anystring */
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const isImplicitAccount = (accountId) =>
    accountId && accountId.length === IMPLICINT_ACCOUNT_MAX_LENGTH && !accountId.includes('.');

const SEPARATOR = '...';

export const shortenAccountId = (id, startChars = 8, endChars = 8) => {
    const numOfRemainingChars = startChars + endChars + SEPARATOR.length;
    const outOfScope = id.length < numOfRemainingChars || numOfRemainingChars > IMPLICINT_ACCOUNT_MAX_LENGTH;
    const partIsMissing = startChars < 1 || endChars < 1;

    if (!isImplicitAccount(id) || outOfScope || partIsMissing) {
        return id;
    }

    return `${id.slice(0, startChars)}${SEPARATOR}${id.slice(id.length - endChars)}`;
};
