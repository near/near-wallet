import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { refreshAccountExternal, getProfileStakingDetails } from '../actions/account'

export function useAccount(accountId) {
    const state = useSelector(state => state)
    const isOwner = state.account.accountId === accountId

    const dispatch = useDispatch()
    useEffect(() => {
        if (!isOwner) {
            (async () => {
                await dispatch(refreshAccountExternal(accountId))
                dispatch(getProfileStakingDetails(accountId))
            })()
        }
    }, [accountId])

    return isOwner
        ? state.account
        : state.allAccounts[accountId] || {}
}
