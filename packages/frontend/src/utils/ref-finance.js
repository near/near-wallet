import { Contract } from 'near-api-js';

import { REF_FINANCE_API_ENDPOINT, REF_FINANCE_CONTRACT} from '../config';
import sendJson from '../tmp_fetch_send_json';
import { wallet } from './wallet';

export const fetchTokenPrices = async () => {
  try {
    return sendJson('GET', REF_FINANCE_API_ENDPOINT + '/list-token-price');
  } catch (error) {
    console.error(`Failed to fetch token prices: ${error}`);
    return {};
  }
};

export const fetchTokenWhiteList = async () => {
  try {
    const whiteListedTokens = await wallet.getAccountBasic('dontcare').viewFunction(REF_FINANCE_CONTRACT, 'get_whitelisted_tokens');;

    return whiteListedTokens;
  } catch (error) {
    console.error(`Failed to fetch whitelisted tokens: ${error}`);
    return [];
  }
};
