import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { updateStaking } from '../../actions/staking'

const initialState = {
    validators: [],
    useLockup: true,
    lockup: {},
    totalStaked: 1,
    totalUnclaimedRewards: 1,
}

const stakingHandlers = handleActions({
    [updateStaking]: (state, { error, payload }) => {
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
