import bs58 from 'bs58';
import nacl from 'tweetnacl';

export function generateKeyPair() {
    return nacl.sign.keyPair();
}

export function encodeMessage(message, privateKey) {
    const encoder = new TextEncoder();
    return nacl.sign(encoder.encode(message), privateKey);
}

export function decodeMessage(cipherText, publicKey) {
    try {
        const opened = nacl.sign.open(cipherText, publicKey);
        if (opened === null) {
            return opened;
        }

        const decoder = new TextDecoder();
        return decoder.decode(opened);
    } catch (e) {
        return null;
    }
}

export function decodeAccountFrom(hash, publicKey) {
    if (!location.hash) {
        return ['', '', ''];
    }

    const bs64encoded = location.hash.slice(1);
    if (!bs64encoded) {
        return ['', '', ''];
    }

    try {
        const cipherText = Uint8Array.from(
            window.atob(bs64encoded).split(',')
        );
        const decoded = decodeMessage(
            cipherText,
            keyFromString(publicKey)
        );

        return (decoded||'').split('=');
    } catch (e) {
        return ['', ''];
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
