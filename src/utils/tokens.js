
import sendJson from '../tmp_fetch_send_json'
import { ACCOUNT_HELPER_URL } from './wallet'


export const getLikelyTokens = async (accountId) => {
    return await sendJson('GET', `${ACCOUNT_HELPER_URL}/account/${accountId}/likelyTokens`)
}

export const getMetadata = async (contract, account) => {
    let metadata

    try {
        metadata = await account.viewFunction(contract, 'ft_metadata')
    } catch (e) {
        // logError(e);
    } finally {
        return {
            contract,
            metadata
        }
    }
}
