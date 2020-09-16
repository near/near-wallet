import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { getValidators } from '../../actions/staking'

const initialState = {
    validators: []
}

const stakingHandlers = handleActions({
    [getValidators]: (state, { error, payload }) => {
        return {
            ...state,
            validators: payload || []
        }
    },
}, initialState)

export default reduceReducers(
    initialState,
    stakingHandlers,
)
