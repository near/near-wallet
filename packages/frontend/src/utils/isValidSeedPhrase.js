import bip39 from 'bip39-light';

export default (seedPhrase) => {
    if (seedPhrase.trim().split(/\s+/g).length < 12) {
        throw new Error('Provided seed phrase must be at least 12 words long');
    }

    const isValidSeedPhrase = bip39.validateMnemonic(seedPhrase.trim());

    if (!isValidSeedPhrase) {
        throw new Error('Provided seed phrase is not valid according to bip39-light standard');
    }

    return isValidSeedPhrase;
};
