import reduceReducers from 'reduce-reducers';
import { handleActions } from 'redux-actions';

import { ACCOUNT_DEFAULTS } from '../../../utils/staking';
import { clearAccountState } from '../../actions/account';
import { staking } from '../../actions/staking';

// sample validator entry
// const validator = {
//     accountId: '',
//     contract: 'validatorContractInstance',
//     // in the UI
//     staked: '0', // amount you have staked RN
//     unclaimed: '0', // rewards earned for the stake you originally deposited
//     unstaked: '0',
//     available: '0', // for withdrawal
//     pending: '0', // pending unstake (4 epochs 48hr then available)
// }

const initialState = {
    allValidators: [],
    accounts: [],
    isLockup: false,
    currentAccount: { ...ACCOUNT_DEFAULTS },
    farmingValidators: {},
};

const stakingHandlers = handleActions({
    [staking.getAccounts]: (state, { payload }) => ({
        ...state,
        accounts: payload,
        accountsObj: {
            accountId: payload[0]?.accountId,
            lockupId: payload[1]?.accountId,
        }
    }),
    [staking.updateAccount]: (state, { ready, error, payload }) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                accounts: state.accounts.map((account) => account.accountId === payload.accountId
                    ? ({
                        ...account,
                        ...payload
                    }) : account
                )
            }),
    [staking.updateLockup]: (state, { ready, error, payload }) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                accounts: state.accounts.map((account) => account.accountId === payload.accountId
                    ? ({
                        ...account,
                        ...payload
                    }) : account
                ),
                lockupId: payload.accountId
            }),
    [staking.updateCurrent]: (state, { payload }) => ({
        ...state,
        currentAccount: payload.currentAccount
    }),
    [staking.getLockup]: (state, { ready, error, payload }) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                lockup: payload
            }),
    [staking.getValidators]: (state, { ready, error, payload }) =>
        (!ready || error)
            ? state
            : ({
                ...state,
                allValidators: payload
            }),
    [staking.setValidatorFarmData]: (state, { payload }) => ({
        ...state,
        farmingValidators: {
            ...state.farmingValidators,
            [payload.validatorId]: {
                ...payload.farmData,
                farmRewards: {
                    ...state.farmingValidators?.[payload.validatorId]
                        ?.farmRewards,
                    ...payload.farmData.farmRewards,
                }
            },
        }
    }),
    [clearAccountState]: () => initialState
}, initialState);

export default reduceReducers(
    initialState,
    stakingHandlers
);
