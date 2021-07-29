import sendJson from '../tmp_fetch_send_json';
import { ACCOUNT_HELPER_URL, wallet } from '../utils/wallet';

const TOKENS_PER_PAGE = 4;

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

    static getTokens = async ({ contractName, accountId, base_uri, numberOfTokensFetched = 0 }) => {
        let tokens;
        try {
            const tokenIds = await this.viewFunctionAccount.viewFunction(contractName, 'nft_tokens_for_owner_set', { account_id: accountId });
            tokens = await Promise.all(tokenIds.slice(numberOfTokensFetched, TOKENS_PER_PAGE + numberOfTokensFetched).map(async token_id => {
                let metadata = await this.viewFunctionAccount.viewFunction(contractName, 'nft_token_metadata', { token_id: token_id.toString() });
                let { media, reference } = metadata;
                if (!media && reference) {
                    // TODO: Filter which URIs are allowed for privacy?
                    // TODO: Figure out ARWeave CORS issue
                    // NOTE: For some reason raw fetch() doesn't have same issue as sendJson
                    // tokenMetadata = sendJson('GET', `${base_uri}/${reference}`);
                    metadata = await (await fetch(`${base_uri}/${reference}`)).json();
                }
                return { token_id, metadata };
            }));
        } catch (e) {
            if (!e.toString().includes('FunctionCallError(MethodResolveError(MethodNotFound))')) {
                throw e;
            }

            // TODO: Pagination
            tokens = await this.viewFunctionAccount.viewFunction(contractName, 'nft_tokens_for_owner', {
                account_id: accountId,
                from_index: numberOfTokensFetched.toString(),
                limit: TOKENS_PER_PAGE
            });
        }
        // TODO: Separate Redux action for loading image
        tokens = await Promise.all(tokens.filter(({ metadata }) => !!metadata).map(async ({ metadata, ...token }) => {
            const { media } = metadata;
            let mediaUrl;
            if (!media.includes('://')) {
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
        }));

        return tokens;
    }
}

export const fungibleTokensService = new NonFungibleTokens();