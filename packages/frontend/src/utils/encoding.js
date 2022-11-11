import passworder from '@metamask/browser-passworder';
import bs58 from 'bs58';
import CryptoJS from 'crypto-js';
import nacl from 'tweetnacl';

const STATIC_NONCE = new Uint8Array([
    190, 12, 82, 22, 119, 120, 120,
    8, 122, 124, 234, 14, 28, 83,
    74, 168, 174, 124, 146, 88, 46,
    200, 208, 82
]);

export function generateKeyPair() {
    return nacl.sign.keyPair();
}

export function generatePublicKey() {
    return generateKeyPair().publicKey;
}

export function encodeMessage(message, publicKey) {
    const encoder = new TextEncoder();

    return nacl.secretbox(encoder.encode(message), STATIC_NONCE, publicKey);
}

export function decodeMessage(cipherText, publicKey) {
    try {
        const opened = nacl.secretbox.open(cipherText, STATIC_NONCE, publicKey);
        if (opened === null) {
            return opened;
        }

        const decoder = new TextDecoder();
        return decoder.decode(opened);
    } catch (e) {
        return null;
    }
}

export function encodeAccountsToHash(accountsData, publicKey) {
    const message = accountsData.reduce((msg, accountData) => {
        msg.push(accountData.join('='));

        return msg;;
    }, []).join('*');

    return window.btoa(encodeMessage(message, publicKey));
}

export function decodeAccountsFrom(hash, publicKey) {
    if (!location.hash) {
        return [];
    }

    const bs64encoded = location.hash.slice(1);
    if (!bs64encoded) {
        return [];
    }

    try {
        const cipherText = Uint8Array.from(
            window.atob(bs64encoded).split(',')
        );
        const decoded = decodeMessage(
            cipherText,
            keyFromString(publicKey)
        );

        return (decoded||'')
            .split('*')
            .map((account) => account.split('='));
    } catch (e) {
        return [];
    }
}

export function keyFromString(key) {
    try {
        return bs58.decode(key);
    } catch (_) {
        return null;
    }

}

export function keyToString(key) {
    return bs58.encode(Buffer.from(key));
}

export const generateCode = (digit = 16) => {
    const saltChars = '0123456789';
    const saltCharsCount = saltChars.length;
    let salt = '';
    for (let i = 0; i < digit; i += 1) {
        salt += saltChars.charAt(Math.floor(Math.random() * saltCharsCount));
    }
    return window.btoa(salt);
};

export const generateKey = async (message) => {
    const hash = new TextEncoder().encode(message);
    const arrayBuffer = await crypto.subtle.digest('SHA-256', hash);
    return Buffer.from(new Uint8Array(arrayBuffer)).toString('base64');
};

/**
 * Export to Sender extension
 * @param {*} message 
 * @param {*} key 
 * @returns 
 */
export const encrypt = async (message, key) => {
    const encryptMessage = await passworder.encrypt(key, message);
    return encryptMessage;
};

/**
 * Export to Sender mobile app
 * @param {*} accountsData 
 * @param {*} pinCode 
 * @param {*} salt 
 * @returns 
 */
export const encryptAccountsData = (accountsData, pinCode, salt) => {
    const hasher = CryptoJS.algo.SHA256.create();
    const key = CryptoJS.PBKDF2(pinCode, salt, { iterations: 10000, hasher }).toString();
    const encryptData = CryptoJS.AES.encrypt(JSON.stringify(accountsData), key).toString();
    return encryptData;
};
