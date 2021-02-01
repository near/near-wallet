import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { refreshAccountExternal, getProfileBalance } from '../actions/account'

export function useAccount(accountId) {
    const state = useSelector(state => state)
    const isOwner = state.account.accountId === accountId

    const dispatch = useDispatch()
    useEffect(() => {
        isOwner || dispatch(refreshAccountExternal(accountId))
    }, [accountId])

    return isOwner
        ? state.account
        : state.allAccounts[accountId] || {}
}
