import { handleAction } from 'redux-actions'
import { refreshAccountExternal } from '../actions/account'

const initialState = {}

const reducer = (state, event) => {
    const { error, meta: { accountId }, payload, ready } = event

    if (!ready) return state

    if (error) {
        return state
    }

    return {
        ...state,
        [accountId]: { 
            accountId, 
            ...payload
        }
    }
}

export default handleAction(refreshAccountExternal, reducer, initialState)
