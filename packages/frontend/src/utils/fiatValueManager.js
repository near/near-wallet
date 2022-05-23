import { Contract } from 'near-api-js';
import DataLoader from 'dataloader';
import Cache from 'node-cache';
import { stringifyUrl } from 'query-string';
import sendJson from '../tmp_fetch_send_json';
import { REF_FINANCE_API_ENDPOINT, REF_FINANCE_CONTRACT} from '../config';
import { wallet } from './wallet';

const COINGECKO_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price';

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
                    return new Promise((resolve, reject) => {
                        return [].fill({}, tokenIds.length);
                    });
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
                    return new Promise((resolve, reject) => [{}]);
                }
            },
            {
                cacheMap: wrapNodeCacheForDataloader(new Cache({ stdTTL: 30, checkperiod: 0, useClones: false }))
            }
        )
    };

    async getPrice(tokens = ['near', 'usn']) {
        const byTokenName = {};
        const prices = await this.fiatValueDataLoader.loadMany(tokens);
        tokens.forEach((tokenName, ndx) => byTokenName[tokenName] = prices[ndx]);
        return byTokenName;
    };

    async fetchTokenPrices(dummyToken = ['near']) {
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
        return formattedValues;
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
