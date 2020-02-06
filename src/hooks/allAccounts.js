import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { LOADING, NOT_FOUND } from '../reducers/allAccounts'
import { loadAccount } from '../actions/account'

export { LOADING, NOT_FOUND }

const initialAccountState = { __status: LOADING }

export function useAccount(accountId) {
    const account = useSelector(state =>
        state.allAccounts[accountId] || initialAccountState
    )
    const dispatch = useDispatch()

    useEffect(() => {
        if (account.__status === LOADING) dispatch(loadAccount(accountId))
    }, [accountId])

    return account
}
