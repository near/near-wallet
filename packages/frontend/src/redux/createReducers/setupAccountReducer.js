import { combineReducers } from 'redux';

import combinedAccountReducers from './combinedAccountReducers';
import { wallet } from '../../utils/wallet';
import activeAccountSlice from '../slices/activeAccount';

export default () => {
    const accountsKeys = Object.keys(wallet.accounts);
    if (!accountsKeys.length) {
        return {};
    }

    return {
        accounts: (state, action) => {
            const reducer = combineReducers(combinedAccountReducers());
            const initialState = reducer({}, {});

            return {
                ...accountsKeys.reduce((accountsState, existingAccountId) => {
                    const accountState = state ? state[existingAccountId] : initialState;

                    return {
                        ...accountsState,
                        [existingAccountId]: 
                            (existingAccountId === state?.activeAccount.accountId)
                                ? reducer(accountState, action)
                                : accountState
                    };
                }, {}),
                [activeAccountSlice.name]: activeAccountSlice.reducer(state?.activeAccount, action)
            };
        }
    };
};
