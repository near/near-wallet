import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { LOADING, NOT_FOUND } from '../reducers/allAccounts'
import { refreshAccountExternal, getProfileBalance } from '../actions/account'

// usunac wszedzie te symbole
export { LOADING, NOT_FOUND }

const initialAccountState = { __status: LOADING }

export function useAccount(accountId) {
    const state = useSelector(state => state)
    const isOwner = state.account.accountId === accountId

    const dispatch = useDispatch()
    useEffect(() => {
        isOwner
            ? dispatch(getProfileBalance())
            : dispatch(refreshAccountExternal(accountId))
    }, [accountId])

    return isOwner
        ? state.account
        : state.allAccounts[accountId] || {}
}
