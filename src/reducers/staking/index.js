import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { getValidators } from '../../actions/staking'

const initialState = {
    validators: [],
    totalStaked: 1,
    totalUnclaimedRewards: 1,
}

const stakingHandlers = handleActions({
    [getValidators]: (state, { error, payload }) => {
        return {
            ...state,
            ...payload,
        }
    },
}, initialState)

export default reduceReducers(
    initialState,
    stakingHandlers,
)
