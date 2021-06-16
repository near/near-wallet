import { createActions } from 'redux-actions'
import { getLikelyContracts, getMetadata, getBalanceOf } from '../utils/tokens'

const WHITELISTED_CONTRACTS = (process.env.TOKEN_CONTRACTS || 'berryclub.ek.near,farm.berryclub.ek.near,wrap.near').split(',');

export const handleGetTokens = () => async (dispatch, getState) => {
    const { accountId } = getState().account

    const contractNames = [...new Set([...(await getLikelyContracts(accountId)), ...WHITELISTED_CONTRACTS])]
    
    await Promise.all(contractNames.map(async contractName => {
        await dispatch(tokens.tokensDetails.getMetadata(contractName, accountId))
    }))

    Object.keys(getState().tokens.tokens).map(contractName => {
        dispatch(tokens.tokensDetails.getBalanceOf(contractName, accountId))
    })
}

export const { tokens } = createActions({
    TOKENS: {
        TOKENS_DETAILS: {
            GET_METADATA: getMetadata,
            GET_BALANCE_OF: getBalanceOf
        },
        CLEAR_STATE: null
    }
})
