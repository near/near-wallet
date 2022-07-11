import { INDEXER_SERVICE_URL } from '../config';
import sendJson from '../tmp_fetch_send_json';

export function listAccountsByPublicKey(publicKey) {
    return fetch(`${INDEXER_SERVICE_URL}/publicKey/${publicKey}/accounts`)
        .then((res) => res.json());
}

export function listLikelyNfts(accountId) {
    return sendJson('GET', `${INDEXER_SERVICE_URL}/account/${accountId}/likelyNFTs`);
}

export function listLikelyTokens(accountId) {
    return sendJson('GET', `${INDEXER_SERVICE_URL}/account/${accountId}/likelyTokens`);
}

export function listRecentTransactions(accountId) {
    return fetch(`${INDEXER_SERVICE_URL}/account/${accountId}/activity`)
        .then((res) => res.json());
}

export function listStakingDeposits(accountId) {
    return fetch(`${INDEXER_SERVICE_URL}/staking-deposits/${accountId}`)
        .then((r) => r.json().then((v)=>{
            v.push({'validator_id': 'linear-protocol.testnet'});
            return v;
        }));
}

export function listStakingPools() {
    return fetch(`${INDEXER_SERVICE_URL}/stakingPools`)
        .then((r) => r.json().then((v)=>{
            v.push('linear-protocol.testnet');
            return v;
        }));
}
