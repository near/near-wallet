import * as nearAPI from 'near-api-js';

import { TOKEN_TRANSFER_DEPOSIT, NFT_TRANSFER_GAS } from '../config';
import { wallet } from '../utils/wallet';
import { listLikelyNfts } from './indexer';

export const TOKENS_PER_PAGE = 4;

const functionCall = nearAPI.transactions.functionCall;

// Methods for interacting with NEP171 tokens (https://nomicon.io/Standards/NonFungibleToken/README.html)
export default class NonFungibleTokens {
    // View functions are not signed, so do not require a real account!
    static viewFunctionAccount = wallet.getAccountBasic('dontcare')

    static getLikelyTokenContracts = async (accountId) => {
        return listLikelyNfts(accountId);
    }

    static getMetadata = async (contractName) => {
        return this.viewFunctionAccount.viewFunction(contractName, 'nft_metadata');
    }

    static getNumberOfTokens = ({ contractName, accountId }) => {
        return this.viewFunctionAccount.viewFunction(contractName, 'nft_supply_for_owner', { account_id: accountId });
    }

    static getToken = async (contractName, tokenId, base_uri) => {
        const token = await this.viewFunctionAccount.viewFunction(contractName, 'nft_token', { token_id: tokenId });

        // need to restructure response for Mintbase NFTs for consistency with NFT spec
        if (token.id && !token.token_id) {
            token.token_id = token.id.toString();
            delete token.id;
        }

        if (token.owner_id && token.owner_id.Account) {
            token.owner_id = token.owner_id.Account;
        }

        if (!token.metadata || !token.metadata.media) {
            token.metadata = {
                ...token.metadata,
                ...(await this.getTokenMetadata(contractName, tokenId, base_uri)),
            };
        }

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
                        token_id: token_id.toString(),
                        owner_id: accountId,
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

    static buildMediaUrl = (media, base_uri) => {
        // return the provided media string if it is empty or already in a URI format
        if (!media || media.includes('://') || media.startsWith('data:image')) {
            return media;
        }

        if (base_uri) {
            return `${base_uri}/${media}`;
        }

        return `https://cloudflare-ipfs.com/ipfs/${media}`;
    }

    static mapTokenMediaUrl = ({ metadata, ...token }, base_uri) => {
        const { media } = metadata;
        return {
            ...token,
            metadata: {
                ...metadata,
                mediaUrl: this.buildMediaUrl(media, base_uri),
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
                    TOKEN_TRANSFER_DEPOSIT
                )
            ]
        });
    }
}

export const nonFungibleTokensService = new NonFungibleTokens();
