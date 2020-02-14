import { handleActions } from 'redux-actions'

import { REFRESH_ACCOUNT } from '../actions/account'

const initialState = []
const availableAccounts = handleActions({
    [REFRESH_ACCOUNT]: (state, { data: { accounts } }) => Object.keys(accounts).sort()
}, initialState)

export default availableAccounts