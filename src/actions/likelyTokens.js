import { createActions } from 'redux-actions'
import { wallet } from '../utils/wallet'

export const handleGetLikelyTokens = () => async (dispatch, getState) => {

    const { tokens } = getState()?.likelyTokens
    const likelyContracts = await dispatch(likelyTokens.get())

}

export const { likelyTokens } = createActions({
    LIKELY_TOKENS: {
        GET: wallet.getLikelyTokens.bind(wallet),
    },
    TOKENS: {
        SET: null
    }
})
