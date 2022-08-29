
export const validateEmail = (email) => {
    /* Checks for anystring@anystring.anystring */
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const isImplicitAccount = (accountId) =>
    accountId && accountId.length === 64 && !accountId.includes('.');

export const shortenAccountId = (id, startChars = 8, endChars = 8) => {
    const separator = '...';
    const shorterThanPossible = id.length < (startChars + endChars + separator.length);
    const partIsMissing = startChars < 1 || endChars < 1;

    if (!isImplicitAccount(id) || shorterThanPossible || partIsMissing) {
        return id;
    }

    return `${id.slice(0, startChars)}${separator}${id.slice(id.length - endChars)}`;
};
