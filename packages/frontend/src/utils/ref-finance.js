import { Contract } from "near-api-js";

import sendJson from '../tmp_fetch_send_json';
import { wallet } from "./wallet";

const REF_FINANCE_API_ENDPOINT = 'https://indexer.ref-finance.net';
const REF_FINANCE_CONTRACT = 'v2.ref-finance.near';

export const fetchTokenPrices = async () => {
  try {
    return sendJson('GET', REF_FINANCE_API_ENDPOINT + '/list-token-price');
  } catch (error) {
    console.error(`Failed to fetch token prices: ${error}`);
    return {};
  }
};

export const fetchTokenWhiteList = async (accountId) => {
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