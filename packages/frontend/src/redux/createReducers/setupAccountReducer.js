import { combineReducers } from 'redux';

import { store } from '../..';
import { wallet } from '../../utils/wallet';
import { selectAccountState } from '../selectors/topLevel';
import combinedAccountReducers from './combinedAccountReducers';

export default () => {
    const accounts = Object.keys(wallet.accounts);
    if (!accounts) {
        return {};
    }

    return accounts.reduce((accountState, accountId) => {
        const reducer = combineReducers(combinedAccountReducers());
        const initialState = reducer(selectAccountState(store?.getState() || {}, { accountId }), {});

        return {
            ...accountState,
            [accountId]: (state = initialState, action) => (
                (accountId === wallet.accountId)
                    ? reducer(state, action)
                    : state
            )
        };
    }, {});
};
