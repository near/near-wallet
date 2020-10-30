import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { LOADING, NOT_FOUND } from '../reducers/allAccounts'
import { refreshAccountExternal } from '../actions/account'

export { LOADING, NOT_FOUND }

const initialAccountState = { __status: LOADING }

export function useAccount(accountId) {
    const account = useSelector(state =>
        state.account.accountId === accountId
            ? state.account
            : state.allAccounts[accountId] || initialAccountState
    )

    const dispatch = useDispatch()

    useEffect(() => {
        if (account.__status === LOADING) dispatch(refreshAccountExternal(accountId))
    }, [accountId])

    return account
}
