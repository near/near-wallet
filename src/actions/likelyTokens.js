import { createActions } from 'redux-actions'
import { wallet } from '../utils/wallet'

const WHITELISTED_CONTRACTS = (process.env.TOKEN_CONTRACTS || 'berryclub.ek.near,farm.berryclub.ek.near,wrap.near').split(',');

export const handleGetLikelyTokens = () => async (dispatch, getState) => {

    const likelyContracts = await dispatch(likelyTokens.get())

    const contracts = [...new Set([...likelyContracts, ...WHITELISTED_CONTRACTS])];
    let loadedTokens = contracts.map(contract => ({
        [contract]: { contract }
    }));
    loadedTokens = loadedTokens.reduce((a, b) => Object.assign(a, b), {});

    dispatch(tokens.set(loadedTokens))

}

export const { likelyTokens, tokens } = createActions({
    LIKELY_TOKENS: {
        GET: wallet.getLikelyTokens.bind(wallet),
    },
    TOKENS: {
        SET: null
    }
})
