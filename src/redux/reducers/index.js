import { combineReducers } from 'redux'

import combinedAccountReducers from './combinedAccountReducers'
import combinedMainReducers from './combinedMainReducers'

import { wallet } from '../../utils/wallet'

const setupReducers = (history, accounts) => {
    if (!accounts.length) {
        return {}
    }

    return accounts.reduce((x, accountId) => {
        const reducer = combinedAccountReducers(history)
        return ({
            ...x,
            [accountId]: (state = reducer({}, {}), action) => (
                (accountId === wallet.accountId)
                    ? reducer(state, action)
                    : state
            )
        })
    }, {})
}
