import { createActions } from 'redux-actions'
import { wallet } from '../utils/wallet'
import { getLikelyTokens, getMetadata, getBalanceOf } from '../utils/tokens'

const WHITELISTED_CONTRACTS = (process.env.TOKEN_CONTRACTS || 'berryclub.ek.near,farm.berryclub.ek.near,wrap.near').split(',');

export const handleGetTokens = () => async (dispatch, getState) => {
    const { accountId } = getState().account

    const likelyContracts = await dispatch(likelyTokens.get(accountId))

    let contracts = [...new Set([...likelyContracts, ...WHITELISTED_CONTRACTS])].reduce((x, contract) => ({
        ...x,
        [contract]: { contract }
    }), {})

    dispatch(tokens.set(contracts))

    const account = await wallet.getAccount(accountId)

    Object.keys(contracts).forEach(async contract => {
        dispatch(tokens.getMetadata(contract, account))
        dispatch(tokens.getBalanceOf(contract, account, accountId))
    })
}

export const { likelyTokens, tokens } = createActions({
    LIKELY_TOKENS: {
        // dodac showAlert onlyError
        GET: getLikelyTokens,
    },
    TOKENS: {
        // ta logike wyzej od `const contracts = [...new Set(` do `dispatch(tokens.set(loadedTokens))` przeniesc tutaj do akcji
        SET: null,
        GET_METADATA: getMetadata,
        GET_BALANCE_OF: getBalanceOf
    }
})
