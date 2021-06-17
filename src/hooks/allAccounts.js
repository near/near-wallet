import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { refreshAccountExternal, getProfileStakingDetails } from '../actions/account'
import { useSelectorActiveAccount } from '../redux/useSelector'

export function useAccount(accountId) {
    const { account } = useSelector(state => state)
    const { allAccounts } = useSelectorActiveAccount(state => state)

    const isOwner = account.accountId === accountId

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
        ? account
        : allAccounts[accountId] || {}
}
