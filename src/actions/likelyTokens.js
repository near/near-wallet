import { createActions } from 'redux-actions'
import { wallet } from '../utils/wallet'
import { getLikelyTokens } from '../utils/tokens'

const WHITELISTED_CONTRACTS = (process.env.TOKEN_CONTRACTS || 'berryclub.ek.near,farm.berryclub.ek.near,wrap.near').split(',');

export const handleGetLikelyTokens = () => async (dispatch, getState) => {

    const likelyContracts = await dispatch(likelyTokens.get())

    const contracts = [...new Set([...likelyContracts, ...WHITELISTED_CONTRACTS])];
    let loadedTokens = contracts.map(contract => ({
        [contract]: { contract }
    }));
    loadedTokens = loadedTokens.reduce((a, b) => Object.assign(a, b), {});

    dispatch(tokens.set(loadedTokens))


    const { accountId } = getState().account
    const account =  await wallet.getAccount(accountId)

    contracts.forEach(async contract => {
        try {
            // TODO: Parallelize balance and metadata calls, use cached metadata?
            let { name, symbol, decimals, icon } = await account.viewFunction(contract, 'ft_metadata')
            const balance = await account.viewFunction(contract, 'ft_balance_of', { account_id: accountId })
            loadedTokens = {
                ...loadedTokens,
                [contract]: { contract, balance, name, symbol, decimals, icon }
            }
        } catch (e) {
            console.log('e', e);
            if (e.message.includes('FunctionCallError(MethodResolveError(MethodNotFound))')) {
                loadedTokens = {...loadedTokens};
                delete loadedTokens[contract];
                return;
            }
            // logError(e);
        } finally {
            dispatch(tokens.set(loadedTokens))
        }
    })

}

export const { likelyTokens, tokens } = createActions({
    LIKELY_TOKENS: {
        GET: getLikelyTokens,
    },
    TOKENS: {
        SET: null
    }
})
