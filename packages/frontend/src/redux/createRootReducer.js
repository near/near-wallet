import { combineReducers } from 'redux';

import { store } from '../';
import { wallet } from '../utils/wallet';
import combinedAccountReducers from './combinedAccountReducers';
import combinedMainReducers from './combinedMainReducers';


const setupAccountReducers = (history) => {
    const accounts = Object.keys(wallet.accounts);
    if (!accounts) {
        return {};
    }

    return accounts.reduce((x, accountId) => {
        const reducer = combinedAccountReducers(history);
        const inicialState = reducer(store?.getState()[accountId], {});

        return ({
            ...x,
            [accountId]: (state = inicialState, action) => (
                (accountId === wallet.accountId)
                    ? reducer(state, action)
                    : state
            )
        });
    }, {});
};

export default (history) => combineReducers({
    ...combinedMainReducers(history),
    ...setupAccountReducers(history)
});
