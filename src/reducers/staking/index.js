import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { updateStaking } from '../../actions/staking'

const initialState = {
    // the current account that's being shown in staking dashboard
    accountId: '',
    // lockup account is active
    useLockup: true,
    // all validators
    totalAvailable: '0', // available for withdrawal
    totalUnstaked: '0', // available to be staked
    totalStaked: '0', 
    totalUnclaimed: '0', // total rewards paid out - staking deposits made
    // list of all validators
    validators: [],
    // [sampleValidator] to show what will be included in each validator object
    sampleValidator: {
        accountId: '',
        contract: 'validatorContractInstance',
        // in the UI
        staked: '0', // amount you have staked RN
        unclaimed: '0', // rewards earned for the stake you originally deposited
        unstaked: '0',
        available: '0', // for withdrawal
        pending: '0', // pending unstake (4 epochs 48hr then available)
    }
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
