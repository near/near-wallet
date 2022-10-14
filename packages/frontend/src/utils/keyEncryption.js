import sha256 from 'js-sha256';
import nacl from 'tweetnacl';
import * as nearApiJs from 'near-api-js';
import { NETWORK_ID } from "../config/configFromEnvironment";
import {KEYSTORE_PREFIX} from "./wallet";

export const createKeyFrom = (value) => Uint8Array.from(sha256.sha256.array(value));

class EncrytedLocalStorage {
    constructor(key) {
        this.key = key;
    }

    getNonceForCurrentClient() {
        return createKeyFrom(window.navigator.userAgent);
    }

    setItem(key, value) {
        const encrypted = this.encrypt(value);
        window.localStorage.setItem(key, encrypted);
    }

    getItem(key) {
        const encrypted = window.localStorage.getItem(key);

        return this.decrypt(encrypted);
    }

    encrypt(value) {
        const encoder = new TextEncoder();
        return window.btoa(
            nacl.secretbox(
                encoder.encode(value),
                this.getNonceForCurrentClient,
                this.key
            )
        );
    }

    decrypt(value) {
        try {
            const box = Uint8Array.from(window.atob(value).split(','));
            const opened = nacl.secretbox.open(box, this.getNonceForCurrentClient, this.key);
            if (opened === null) {
                return opened;
            }

            const decoder = new TextDecoder();
            return decoder.decode(opened);
        } catch (e) {
            return null;
        }
    }
}

// получается что если ручками убрать в лс этот ключ, то кошель будет думать что энкрипшна нет,
// поэтому при создании кейстораджа надо будет чекать является ли приватник шифрованным или нет (проверять по формату)
export const KEY_ENCRYPTED_ACCOUNTS_WITH_PASS = 'wallet:encrypted';

let isAuthorized = false;

// const encrypt = (value, nonce, key) => {
//     const encoder = new TextEncoder();
//     return window.btoa(nacl.secretbox(encoder.encode(value), nonce, key));
// };
//
// const decrypt = (value, nonce, key) => {
//     try {
//         const box = Uint8Array.from(window.atob(value).split(','));
//         const opened = nacl.secretbox.open(box, nonce, key);
//         if (opened === null) {
//             return opened;
//         }
//
//         const decoder = new TextDecoder();
//         return decoder.decode(opened);
//     } catch (e) {
//         return null;
//     }
// };

export const HAS_ENCRYPTION = Boolean(localStorage.getItem(KEY_ENCRYPTED_ACCOUNTS_WITH_PASS));

export const isKeyEncrypted = () => HAS_ENCRYPTION && !isAuthorized;

// export const isKeyDecrypted = () => HAS_ENCRYPTION && isAuthorized;

/**
 * Takes nonce from current UserAgent
 * @returns {Uint8Array}
 */
export const isKeyValid = async (key, accountId) => {
    const keyStore = new nearApiJs.keyStores.BrowserLocalStorageKeyStore(
        new EncrytedLocalStorage(key),
        KEYSTORE_PREFIX
    );
    // console.log(keyStore)

    // console.log(NETWORK_ID);
    const encryptedKeyPair = await keyStore.getKey(NETWORK_ID, accountId);
    console.log(encryptedKeyPair);
    // if (!encryptedKeyPair) {
    //     // todo sentry
    //     console.error('Unexisted accountId');
    //
    //     return false;
    // }



    // const decrypted = decrypt(encryptedKeyPair.priv, getNonceForCurrentClient(), key)





    // return decrypt(encryptedValue, getNonceForCurrentClient(), key);
};

// export const encryptStatic = (key) =>
//     encrypt(STATIC, NONCE, key);

// export const setEncryptedStatic = (value) =>
//     localStorage.setItem(KEY_ENCRYPTED_ACCOUNTS_WITH_PASS, value);
