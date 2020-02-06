import { handleAction } from 'redux-actions'
import { loadAccount } from '../actions/account'

export const LOADED = Symbol('LOADED')
export const LOADING = Symbol('LOADING')
export const NOT_FOUND = Symbol('NOT_FOUND')

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

export default handleAction(loadAccount, reducer, initialState)
