import api from './api';
import Cache from './cache';


const UPDATE_REQUEST_INTERVAL_NS = 1000 * 30 * 1000000;
const LIKELY_NFT_KEY = 'likelyNFTs';
const LIKELY_TOKENS_KEY = 'likelyTokens';

export default {
    listLikelyNfts(accountId) {
        return Cache.accumulate({
            accountId,
            kind: LIKELY_NFT_KEY,
            updater: (timestamp) => api.listLikelyNfts(accountId, timestamp),
            timeoutNs: UPDATE_REQUEST_INTERVAL_NS,
        });
    },
    listLikelyTokens(accountId, timestamp) {
        return Cache.accumulate({
            accountId,
            kind: LIKELY_TOKENS_KEY,
            updater: (timestamp) => api.listLikelyTokens(accountId, timestamp),
            timeoutNs: UPDATE_REQUEST_INTERVAL_NS,
        });
    }
};
