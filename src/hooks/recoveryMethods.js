import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadRecoveryMethods } from '../actions/account'
import { useSelectorActiveAccount } from '../redux/useSelector'
import { wallet } from '../utils/wallet'

const empty = []

export function useRecoveryMethods(accountId) {
    const recoveryMethods = useSelectorActiveAccount(state =>
        state.recoveryMethods[accountId]
    )

    const dispatch = useDispatch()

    useEffect(() => {
        if (accountId === wallet.accountId) {
            dispatch(loadRecoveryMethods())
        }
    }, [accountId])

    return recoveryMethods || empty
}
