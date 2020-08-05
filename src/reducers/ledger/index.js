import { handleActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import {
    getLedgerAccountIds,
    addLedgerAccountId,
    saveAndSelectLedgerAccounts
} from '../../actions/account'

const initialState = {
    
}

const ledger = handleActions({
    [getLedgerAccountIds]: (state, { error, payload }) => {
        if (error) {
            return {
                ...state,
                signInWithLedger: undefined
            }
        }

        return {
            ...state,
            signInWithLedger: payload 
                ? payload.reduce((r, accountId) => ({
                    ...r,
                    [accountId]: {
                        status: 'waiting'
                    }
                }), {})
                : {}
        }
    },
    [addLedgerAccountId]: (state, { error, payload, ready, meta }) => {
        if (error) {
            return {
                ...state,
                signInWithLedger: undefined
            }
        }

        return {
            ...state,
            signInWithLedger: {
                ...state.signInWithLedger,
                [meta.accountId]: {
                    status: ready ? 'success' : 'pending'
                }
            }
        }
    },
    [saveAndSelectLedgerAccounts]: (state, { error }) => {
        if (error) {
            return {
                ...state,
                signInWithLedger: undefined
            }
        }

        return state
    }
}, initialState)

export default reduceReducers(
    initialState,
    ledger
)
