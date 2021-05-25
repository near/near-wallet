import { handleActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { likelyTokens } from '../../actions/likelyTokens'

const initialState = {
    tokens: []
}

const tokens = handleActions({
    
}, initialState)

export default reduceReducers(
    initialState,
    tokens
)
