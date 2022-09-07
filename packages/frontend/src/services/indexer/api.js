import { stringifyUrl } from 'query-string';

import { INDEXER_SERVICE_URL } from '../../config';
import sendJson from '../../tmp_fetch_send_json';
import { CUSTOM_REQUEST_HEADERS } from '../../utils/constants';

export default {
    listAccountsByPublicKey: (publicKey) => {
        return fetch(`${INDEXER_SERVICE_URL}/publicKey/${publicKey}/accounts`, {
            headers: {
                ...CUSTOM_REQUEST_HEADERS,
            }})
            .then((res) => res.json());
    },
    listLikelyNfts: (accountId, timestamp) => {
        const url = `${INDEXER_SERVICE_URL}/account/${accountId}/likelyNFTsFromBlock`;
        return sendJson('GET', stringifyUrl({ url, query: {
            fromBlockTimestamp: timestamp
        }}));
    },
    listLikelyTokens: (accountId, timestamp) => {
        const url = `${INDEXER_SERVICE_URL}/account/${accountId}/likelyTokensFromBlock`;

        return sendJson('GET', stringifyUrl({ url, query: {
            fromBlockTimestamp: timestamp
        }}));
    },
    listRecentTransactions: (accountId) => {
        return fetch(`${INDEXER_SERVICE_URL}/account/${accountId}/activity`, {
            headers: {
                ...CUSTOM_REQUEST_HEADERS,
            }})
            .then((res) => res.json());
    },
    listStakingDeposits: (accountId) => {
        return fetch(`${INDEXER_SERVICE_URL}/staking-deposits/${accountId}`, {
            headers: {
                ...CUSTOM_REQUEST_HEADERS,
            }})
            .then((r) => r.json());
    },
    listStakingPools: () => {
        return fetch(`${INDEXER_SERVICE_URL}/stakingPools`, {
            headers: {
                ...CUSTOM_REQUEST_HEADERS,
            }})
            .then((r) => r.json());
    },
};
