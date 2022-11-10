import api from './indexer/api';
import cachedApi from './indexer/cached-api';

export const listAccountsByPublicKey = api.listAccountsByPublicKey;
export const listLikelyNfts =  cachedApi.listLikelyNfts;
export const listLikelyTokens = cachedApi.listLikelyTokens;
export const listRecentTransactions = api.listRecentTransactions;
export const listStakingDeposits = api.listStakingDeposits;
export const listStakingPools = api.listStakingPools;
