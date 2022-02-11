
import { ACCOUNT_HELPER_URL } from '../config';

export let controller;

export async function getAccountIds(publicKey) {
    controller = new AbortController();
    return await fetch(`${ACCOUNT_HELPER_URL}/publicKey/${publicKey}/accounts`, { signal: controller.signal }).then((res) => res.json());
}

export function checkIsValidUrl(url) {
    if (!url) {
        return false;
    }

    const urlProtocol = new URL(url).protocol;
    if (urlProtocol !== 'http:' && urlProtocol !== 'https:') {
        return false;
    }

    return true;
}
