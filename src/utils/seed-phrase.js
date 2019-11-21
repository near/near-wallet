import * as bip39 from 'bip39-light'
import { derivePath } from 'near-hd-key'
import * as bs58 from 'bs58'
import * as nacl from 'tweetnacl'

export const KEY_DERIVATION_PATH = "m/44'/397'/0'"

export const generateSeedPhrase = () => {
    return parseSeedPhrase(bip39.generateMnemonic())
}

export const normalizeSeedPhrase = (seedPhrase) => seedPhrase.trim().split(/\s+/).map(part => part.toLowerCase()).join(' ')

export const parseSeedPhrase = (seedPhrase) => {
    const seed = bip39.mnemonicToSeed(normalizeSeedPhrase(seedPhrase))
    const { key } = derivePath(KEY_DERIVATION_PATH, seed.toString('hex'))
    const keyPair = nacl.sign.keyPair.fromSeed(key)
    const publicKey = 'ed25519:' + bs58.encode(Buffer.from(keyPair.publicKey))
    const secretKey = 'ed25519:' + bs58.encode(Buffer.from(keyPair.secretKey))
    return { seedPhrase, secretKey, publicKey }
}

export const findSeedPhraseKey = (seedPhrase, publicKeys) => {
    // TODO: Need to iterate through multiple possible keys
    const keyInfo = parseSeedPhrase(seedPhrase)
    if (publicKeys.indexOf(keyInfo.publicKey) < 0) {
        return {}
    }
    return keyInfo
}