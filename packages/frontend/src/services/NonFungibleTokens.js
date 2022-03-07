import * as nearAPI from 'near-api-js';

import { ACCOUNT_HELPER_URL } from '../config';
import sendJson from '../tmp_fetch_send_json';
import { wallet } from '../utils/wallet';

export const TOKENS_PER_PAGE = 4;
export const NFT_TRANSFER_GAS = nearAPI.utils.format.parseNearAmount('0.00000000003');

export const NFT_TRANSFER_DEPOSIT = 1; // 1 yocto Near

const functionCall = nearAPI.transactions.functionCall;

// Methods for interacting witn NEP171 tokens (https://nomicon.io/Standards/NonFungibleToken/README.html)
export default class NonFungibleTokens {
    // View functions are not signed, so do not require a real account!
    static viewFunctionAccount = wallet.getAccountBasic('dontcare')

    static getLikelyTokenContracts = async (accountId) => {
        return sendJson('GET', `${ACCOUNT_HELPER_URL}/account/${accountId}/likelyNFTs`);
    }

    static getMetadata = async (contractName) => {
        return this.viewFunctionAccount.viewFunction(contractName, 'nft_metadata');
    }

    static getNumberOfTokens = ({ contractName, accountId }) => {
        return this.viewFunctionAccount.viewFunction(contractName, 'nft_supply_for_owner', { account_id: accountId });
    }

    static getToken = async (contractName, tokenId, base_uri) => {
        const token = await this.viewFunctionAccount.viewFunction(contractName, 'nft_token', { token_id: tokenId });
        return this.mapTokenMediaUrl(token, base_uri);
    }

    static getTokenMetadata = async (contractName, tokenId, base_uri) => {
        let metadata = await this.viewFunctionAccount.viewFunction(contractName, 'nft_token_metadata', { token_id: tokenId });
        let { media, reference } = metadata;
        if (!media && reference) {
            // TODO: Filter which URIs are allowed for privacy?
            // TODO: Figure out ARWeave CORS issue
            // NOTE: For some reason raw fetch() doesn't have same issue as sendJson
            // tokenMetadata = sendJson('GET', `${base_uri}/${reference}`);
            metadata = await (await fetch(`${base_uri}/${reference}`)).json();
        }

        return metadata;
    }

    static getTokens = async ({ contractName, accountId, base_uri, fromIndex = 0 }) => {
        let tokens;
        try {
            const tokenIds = await this.viewFunctionAccount.viewFunction(contractName, 'nft_tokens_for_owner_set', { account_id: accountId });
            tokens = await Promise.all(
                tokenIds.slice(fromIndex, TOKENS_PER_PAGE + fromIndex)
                    .map(async (token_id) => ({
                        token_id,
                        metadata: await this.getTokenMetadata(contractName, token_id.toString(), base_uri),
                    }))
            );
        } catch (e) {
            if (!e.toString().includes('FunctionCallError(MethodResolveError(MethodNotFound))')) {
                throw e;
            }

            tokens = await this.viewFunctionAccount.viewFunction(contractName, 'nft_tokens_for_owner', {
                account_id: accountId,
                from_index: fromIndex.toString(),
                limit: TOKENS_PER_PAGE
            });
        }
        // TODO: Separate Redux action for loading image
        return tokens.filter(({ metadata }) => !!metadata)
            .map((token) => this.mapTokenMediaUrl(token, base_uri));
    }

    static mapTokenMediaUrl = ({ metadata, ...token }, base_uri) => {
        const { media } = metadata;
        let mediaUrl;
        if (media && !media.includes('://')) {
            if (base_uri) {
                mediaUrl = `${base_uri}/${media}`;
            } else {
                mediaUrl = `https://cloudflare-ipfs.com/ipfs/${media}`;
            }
        } else {
            mediaUrl = media;
        }

        return {
            ...token,
            metadata: {
                ...metadata,
                mediaUrl
            }
        };
    }

    static transfer = async ({ accountId, contractId, tokenId, receiverId }) => {
        const account = await wallet.getAccount(accountId);

        return account.signAndSendTransaction({
            receiverId: contractId,
            actions: [
                functionCall(
                    'nft_transfer', 
                    {
                        receiver_id: receiverId,
                        token_id: tokenId
                    },
                    NFT_TRANSFER_GAS,
                    NFT_TRANSFER_DEPOSIT
                )
            ]
        });
    }
}

export const nonFungibleTokensService = new NonFungibleTokens();
