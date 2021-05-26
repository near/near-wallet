import { createActions } from 'redux-actions'
import { wallet } from '../utils/wallet'
import { getLikelyTokens, getMetadata, getBalanceOf } from '../utils/tokens'

const WHITELISTED_CONTRACTS = (process.env.TOKEN_CONTRACTS || 'berryclub.ek.near,farm.berryclub.ek.near,wrap.near').split(',');

export const handleGetLikelyTokens = () => async (dispatch, getState) => {

    const { accountId } = getState().account
    const account = await wallet.getAccount(accountId)

    const likelyContracts = await dispatch(likelyTokens.get(accountId))

    const contracts = [...new Set([...likelyContracts, ...WHITELISTED_CONTRACTS])];
    let loadedTokens = contracts.map(contract => ({
        [contract]: { contract }
    }));
    loadedTokens = loadedTokens.reduce((a, b) => Object.assign(a, b), {});

    dispatch(tokens.set(loadedTokens))
    
    contracts.forEach(async contract => {
        dispatch(tokens.getMetadata(contract, account))
        dispatch(tokens.getBalanceOf(contract, account, accountId))
    })

}

export const { likelyTokens, tokens } = createActions({
    LIKELY_TOKENS: {
        GET: getLikelyTokens,
    },
    TOKENS: {
        SET: null,
        GET_METADATA: getMetadata,
        GET_BALANCE_OF: getBalanceOf
    }
})
