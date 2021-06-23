import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from '../redux/useSelector'

export function useAccount(accountId) {
    const { account } = useSelector(state => state)
    const { allAccounts } = useSelector(state => state)

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
