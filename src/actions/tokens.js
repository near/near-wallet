import { createActions } from 'redux-actions'
import { getLikelyContracts, getMetadata, getBalanceOf } from '../utils/tokens'

const WHITELISTED_CONTRACTS = (process.env.TOKEN_CONTRACTS || 'berryclub.ek.near,farm.berryclub.ek.near,wrap.near').split(',');

export const handleGetTokens = () => async (dispatch, getState) => {
    const { accountId } = getState().account

    await dispatch(tokens.likelyContracts.get(accountId))

    const { tokens: contractNames } = getState().tokens

    await Promise.all(Object.keys(contractNames).map(async contractName => {
        await dispatch(tokens.tokensDetails.getMetadata(contractName, accountId))
    }))

    Object.keys(contractNames).map(contractName => {
        getState().tokens.tokens[contractName].spec && dispatch(tokens.tokensDetails.getBalanceOf(contractName, accountId))
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
