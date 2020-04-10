import { handleActions } from 'redux-actions'

import { refreshAccount } from '../actions/account'

const initialState = []
const availableAccounts = handleActions({
    [refreshAccount]: (state, { payload }) => Object.keys((payload && payload.accounts) || {}).sort()
}, initialState)

export default availableAccounts