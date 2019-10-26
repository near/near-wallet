import * as bip39 from 'bip39-light'
import { derivePath } from 'ed25519-hd-key'
import * as bs58 from 'bs58'
import * as nacl from 'tweetnacl'

export const KEY_DERIVATION_PATH = "m/44'/397'/0'"

export const generate = () => {
    return parse(bip39.generateMnemonic())
}

export const parse = (seedPhrase) => {
    const seed = bip39.mnemonicToSeed(seedPhrase)
    const { key } = derivePath(KEY_DERIVATION_PATH, seed.toString('hex'))
    const keyPair = nacl.sign.keyPair.fromSeed(key)
    const publicKey = 'ed25519:' + bs58.encode(Buffer.from(keyPair.publicKey))
    const secretKey = 'ed25519:' + bs58.encode(Buffer.from(keyPair.secretKey))
    return { seedPhrase, secretKey, publicKey }
}

export const findKey = (seedPhrase, publicKeys) => {
    // TODO: Need to iterate through multiple possible keys
    const keyInfo = parse(seedPhrase)
    if (publicKeys.indexOf(keyInfo.publicKey) < 0) {
        return {}
    }
    return keyInfo
}