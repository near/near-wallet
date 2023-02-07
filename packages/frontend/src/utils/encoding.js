import bs58 from 'bs58';
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

export function encodeAccountsToHash(accountsData, publicKey) {
    const message = accountsData.reduce((msg, accountData) => {
        msg.push(accountData.join('='));

        return msg;;
    }, []).join('*');

    return window.btoa(encodeMessage(message, publicKey));
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
