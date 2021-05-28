import { createActions } from 'redux-actions'
import { getLikelyContracts, getMetadata, getBalanceOf } from '../utils/tokens'

const WHITELISTED_CONTRACTS = (process.env.TOKEN_CONTRACTS || 'berryclub.ek.near,farm.berryclub.ek.near,wrap.near').split(',');

export const handleGetTokens = () => async (dispatch, getState) => {
    const { accountId } = getState().account

    await dispatch(tokens.likelyContracts.get(accountId))

    const { tokens: contracts } = getState().tokens

    await Promise.all(Object.keys(contracts).map(async contract => {
        await dispatch(tokens.tokensDetails.getMetadata(contract, accountId))
    }))

    Object.keys(contracts).map(async contract => {
        await dispatch(tokens.tokensDetails.getBalanceOf(contract, accountId))
    })
}

export const { tokens } = createActions({
    TOKENS: {
        LIKELY_CONTRACTS: {
            GET: [
                getLikelyContracts,
                () => WHITELISTED_CONTRACTS
            ],
        },
        TOKENS_DETAILS: {
            GET_METADATA: getMetadata,
            GET_BALANCE_OF: getBalanceOf
        },
        CLEAR_STATE: null
    }
})
