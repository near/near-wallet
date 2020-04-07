import { handleAction } from 'redux-actions'
import { loadRecoveryMethods } from '../actions/account'

const initialState = {}

const reducer = (state, event) => {
    const { error, meta: { accountId }, payload, ready } = event

    if (!ready || error) return state

    // payload is an array of recoveryMethods
    return { ...state, [accountId]: payload }
}

export default handleAction(loadRecoveryMethods, reducer, initialState)
