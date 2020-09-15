
import { ACCOUNT_HELPER_URL } from './wallet'

export let controller

export async function getAccountIds(publicKey) {
    controller = new AbortController()
    return await fetch(`${ACCOUNT_HELPER_URL}/publicKey/${publicKey}/accounts`, { signal: controller.signal }).then((res) => res.json())
}
