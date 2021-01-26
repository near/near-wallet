import { handleAction } from 'redux-actions'
import { refreshAccountExternal } from '../actions/account'

const initialState = {}

const reducer = (state, event) => {
    const { error, meta: { accountId }, payload, ready } = event

    if (!ready) return state

    if (error) {
        if (payload.message.match('does not exist')) {
            return { ...state, [accountId]: { __status: NOT_FOUND } }
        }

        console.error('error loading profile!', payload)
        return state
    }

    return {
        ...state,
        [accountId]: { accountId, ...payload, __status: LOADED },
    }
}

export default handleAction(refreshAccountExternal, reducer, initialState)
