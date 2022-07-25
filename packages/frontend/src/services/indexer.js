import { INDEXER_SERVICE_URL } from '../config';
import sendJson from '../tmp_fetch_send_json';
import { buildUrlOptParam } from '../utils/url';
import Cache, { IndexerCache } from './indexerCache';


function sendAndCacheJson (url, cacheOptions) {
    const { accountId, kind } = cacheOptions;
    const result = Cache.accumulate(accountId, kind, (timestamp) => {
        return sendJson('GET', buildUrlOptParam(url, {
            fromBlockTimestamp: timestamp
        }));
    });

    return result;
}

export function listAccountsByPublicKey(publicKey) {
    return fetch(`${INDEXER_SERVICE_URL}/publicKey/${publicKey}/accounts`)
        .then((res) => res.json());
}

export function listLikelyNfts(accountId) {
    const url = `${INDEXER_SERVICE_URL}/account/${accountId}/likelyNFTs`;

    return sendAndCacheJson(url, {
        accountId,
        kind: IndexerCache.LIKELY_NFT_KEY,
    });
}

export function listLikelyTokens(accountId) {
    const url = `${INDEXER_SERVICE_URL}/account/${accountId}/likelyTokens`;

    return sendAndCacheJson(url, {
        accountId,
        kind: IndexerCache.LIKELY_TOKENS_KEY,
    });
}

export function listRecentTransactions(accountId) {
    return fetch(`${INDEXER_SERVICE_URL}/account/${accountId}/activity`)
        .then((res) => res.json());
}

export function listStakingDeposits(accountId) {
    return fetch(`${INDEXER_SERVICE_URL}/staking-deposits/${accountId}`)
        .then((r) => r.json());
}

export function listStakingPools() {
    return fetch(`${INDEXER_SERVICE_URL}/stakingPools`)
        .then((r) => r.json());
}
