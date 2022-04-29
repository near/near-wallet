import { combineReducers } from 'redux';

import { store } from '../..';
import { wallet } from '../../utils/wallet';
import { selectAccountState } from '../selectors/topLevel';
import combinedAccountReducers from './combinedAccountReducers';

export default (accountId) => {
    const accountsKeys = Object.keys(wallet.accounts);
    if (!accountsKeys.length) {
        return {};
    }

    return {
        accounts: combineReducers(
            accountsKeys.reduce((accountState, existingAccountId) => {
                const reducer = combineReducers(combinedAccountReducers());
                const initialState = reducer(selectAccountState(store?.getState() || {}, { existingAccountId }), {});
        
                return {
                    ...accountState,
                    [existingAccountId]: (state = initialState, action) => (
                        (existingAccountId === accountId)
                            ? reducer(state, action)
                            : state
                    )
                };
            }, {})
        )
    };
};
