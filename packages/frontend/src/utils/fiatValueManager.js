import DataLoader from 'dataloader';
import { Contract } from 'near-api-js';
import Cache from 'node-cache';
import { stringifyUrl } from 'query-string';

import { REF_FINANCE_API_ENDPOINT, REF_FINANCE_CONTRACT, ACCOUNT_ID_SUFFIX } from '../config';
import sendJson from '../tmp_fetch_send_json';
import { wallet } from './wallet';

const COINGECKO_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price';
const COINGECKO_SEARCH_URL = 'https://api.coingecko.com/api/v3/search';

function wrapNodeCacheForDataloader(cache) {
    return {
        get: (...args) => {
            return cache.get(...args);
        },

        set: (...args) => {
            return cache.set(...args);
        },

        delete: (...args) => {
            return cache.del(...args);
        },

        clear: (...args) => {
            return cache.flushAll(...args);
        }
    };
}

export default class FiatValueManager {
    constructor() {
        this.contractNameToCoinGeckoId = new DataLoader(
            async (tokenSymbols) => {
                const tokenIds = [];
                for (const tokenSymbol of tokenSymbols) {
                    try {
                        const { coins } = await sendJson(
                            'GET', 
                            stringifyUrl({
                                url: COINGECKO_SEARCH_URL,
                                query: tokenSymbol
                            })
                        );
                        const coin = coins.find((coin) => coin?.symbol.toUpperCase() == tokenSymbol.toUpperCase());
                        if (coin?.id) {
                            tokenIds.push(coin.id);
                        }
                    } catch (error) {
                        console.error(`Failed to fetch coingecko id: ${error}`);
                        tokenIds.push(undefined);
                    }
                }
                return tokenIds;
            }
        );
        this.coinGeckoFiatValueDataLoader = new DataLoader(
            async (tokenIds) => {
                try {
                    const tokenFiatValues = await sendJson(
                        'GET', 
                        stringifyUrl({
                            url: COINGECKO_PRICE_URL,
                            query: {
                                ids: tokenIds.join(','),
                                vs_currencies: 'usd,eur,cny',
                                include_last_updated_at: true
                            }
                        })
                    );
                    return tokenIds.map((id) => tokenFiatValues[id]);
                } catch (error) {
                    console.error(`Failed to fetch coingecko prices: ${error}`);
                    // DataLoader must be constructed with a function which accepts 
                    // Array<key> and returns Promise<Array<value>> of the same length
                    // as the Array of keys
                    return Promise.resolve(Array(tokenSymbols.length).fill({}));
                }
            },
            {
                /* 0 checkperiod means we only purge values from the cache on attempting to read an expired value
                Which allows us to avoid having to call `.close()` on the cache to allow node to exit cleanly */
                cacheMap: wrapNodeCacheForDataloader(new Cache({ stdTTL: 30, checkperiod: 0, useClones: false }))
            }
        );
        this.refFinanceDataLoader = new DataLoader(
            async (dummyToken) => {
                try {
                    const refFinanceTokenFiatValues = await sendJson(
                        'GET',
                        REF_FINANCE_API_ENDPOINT + '/list-token-price'
                    );
                    return [refFinanceTokenFiatValues];
                } catch (error) {
                    console.error(`Failed to fetch ref-finance prices: ${error}`);
                    return Promise.resolve([{}]);
                }
            },
            {
                cacheMap: wrapNodeCacheForDataloader(new Cache({ stdTTL: 30, checkperiod: 0, useClones: false }))
            }
        );
    };

    async fetchCoinGeckoIds(contractNames = ['near', 'usn']) {
        // given list of contract names, return list of coingecko IDs
        return this.contractNameToCoinGeckoId.loadMany(contractNames);
    };

    async fetchCoinGeckoPrices(contractNames = ['near', 'usn']) {
        const coinGeckoIds = await this.fetchCoinGeckoIds(contractNames);

        while (coinGeckoIds.includes(undefined)) {
            const indexToClear = coinGeckoIds.indexOf(undefined);
            this.contractNameToCoinGeckoId.clear(contractNames[indexToClear]);
            coinGeckoIds.splice(indexToClear, 1);
        }
        const byTokenName = {};
        const prices = await this.coinGeckoFiatValueDataLoader.loadMany(coinGeckoIds);
        contractNames.forEach((tokenName, ndx) => byTokenName[tokenName] = prices[ndx]);
        return byTokenName;
    };

    async fetchRefFinancePrices(dummyToken = ['near']) {
        const [prices] = await this.refFinanceDataLoader.loadMany(dummyToken);
        const last_updated_at = Date.now() / 1000; 
        const formattedValues = Object.keys(prices).reduce((acc, curr) => {
            return ({
                ...acc,
                [curr]: {
                    usd: +Number(prices[curr]?.price).toFixed(2) || null,
                    last_updated_at
                }
            });
        }, {});
        return {...formattedValues, near: formattedValues[`wrap.${ACCOUNT_ID_SUFFIX}`]};
    };

    async fetchTokenWhiteList(accountId) {
        try {
            const account = wallet.getAccountBasic(accountId);
            const contract = new Contract(account, REF_FINANCE_CONTRACT, {viewMethods: ['get_whitelisted_tokens']});
            const whiteListedTokens = await contract.get_whitelisted_tokens();
        
            return whiteListedTokens;
        } catch (error) {
            console.error(`Failed to fetch whitelisted tokens: ${error}`);
            return [];
        }
    };
}
