import { handleActions } from 'redux-actions'

import { refreshAccountOwner } from '../redux/actions/account'

const initialState = []
const availableAccounts = handleActions({
    [refreshAccountOwner]: (state, { payload }) => Object.keys((payload && payload.accounts) || {}).sort()
}, initialState)

export default availableAccounts
