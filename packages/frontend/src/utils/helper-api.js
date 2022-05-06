
import * as nearApiJs from 'near-api-js';
import { parseSeedPhrase } from 'near-seed-phrase';

import { USE_INDEXER_SERVICE } from '../../../../features';
import { ACCOUNT_HELPER_URL } from '../config';
import { listAccountsByPublicKey } from '../services/indexer';

export let controller;

export async function getAccountIds(publicKey) {
    controller = new AbortController();
    if (!USE_INDEXER_SERVICE) {
        return await fetch(`${ACCOUNT_HELPER_URL}/publicKey/${publicKey}/accounts`, { signal: controller.signal }).then((res) => res.json());
    }
    return listAccountsByPublicKey(publicKey);
}

export async function getAccountIdsBySeedPhrase(seedPhrase) {
    const { secretKey } = parseSeedPhrase(seedPhrase);
    const keyPair = nearApiJs.KeyPair.fromString(secretKey);
    const publicKey = keyPair.publicKey.toString();
    return getAccountIds(publicKey);
}

export function isUrlNotJavascriptProtocol(url) {
    if (!url) {
        return true;
    }

    const urlProtocol = new URL(url).protocol;
    if (urlProtocol === 'javascript:') {
        console.log('Invalid URL protocol:', urlProtocol, 'URL cannot execute JavaScript');
        return false;
    }

    return true;
}
