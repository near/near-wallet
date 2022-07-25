import { INDEXER_SERVICE_URL } from '../../config';
import sendJson from '../../tmp_fetch_send_json';
import { buildUrlOptParam } from '../../utils/url';

export default {
    listAccountsByPublicKey: (publicKey) => {
        return fetch(`${INDEXER_SERVICE_URL}/publicKey/${publicKey}/accounts`)
            .then((res) => res.json());
    },
    listLikelyNfts: (accountId, timestamp) => {
        const url = `${INDEXER_SERVICE_URL}/account/${accountId}/likelyNFTs`;

        return sendJson('GET', buildUrlOptParam(url, {
            fromBlockTimestamp: timestamp
        }));
    },
    listLikelyTokens: (accountId, timestamp) => {
        const url = `${INDEXER_SERVICE_URL}/account/${accountId}/likelyTokens`;

        return sendJson('GET', buildUrlOptParam(url, {
            fromBlockTimestamp: timestamp
        }));
    },
    listRecentTransactions: (accountId) => {
        return fetch(`${INDEXER_SERVICE_URL}/account/${accountId}/activity`)
            .then((res) => res.json());
    },
    listStakingDeposits: (accountId) => {
        return fetch(`${INDEXER_SERVICE_URL}/staking-deposits/${accountId}`)
            .then((r) => r.json());
    },
    listStakingPools: () => {
        return fetch(`${INDEXER_SERVICE_URL}/stakingPools`)
            .then((r) => r.json());
    },
};
