
import { ACCOUNT_HELPER_URL } from './wallet'

export async function getAccountIds(publicKey) {
    return await fetch(`${ACCOUNT_HELPER_URL}/publicKey/${publicKey}/accounts`).then((res) => res.json())
}