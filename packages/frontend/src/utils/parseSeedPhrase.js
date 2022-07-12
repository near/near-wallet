import { KeyPair } from 'near-api-js';
import { parseSeedPhrase } from 'near-seed-phrase';

export function getImplicitAccountIdFromSeedPhrase(seedPhrase) {
    const { secretKey } = parseSeedPhrase(seedPhrase);
    const recoveryKeyPair = KeyPair.fromString(secretKey);
    return Buffer.from(recoveryKeyPair.publicKey.data).toString('hex');
};

export function getKeyPairFromSeedPhrase(seedPhrase) {
    const { secretKey } = parseSeedPhrase(seedPhrase);
    return KeyPair.fromString(secretKey);
};

