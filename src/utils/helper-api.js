
import { ACCOUNT_HELPER_URL } from './wallet'

export const controller = new AbortController()

export async function getAccountIds(publicKey) {
    return await fetch(`${ACCOUNT_HELPER_URL}/publicKey/${publicKey}/accounts`, { signal: controller.signal }).then((res) => res.json())
}
