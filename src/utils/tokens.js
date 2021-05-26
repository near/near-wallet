
import sendJson from '../tmp_fetch_send_json'
import { ACCOUNT_HELPER_URL } from './wallet'


export const getLikelyTokens = async (accountId) => {
    return await sendJson('GET', `${ACCOUNT_HELPER_URL}/account/${accountId}/likelyTokens`)
}
