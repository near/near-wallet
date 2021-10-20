import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actions as recoveryMethodsActions, selectRecoveryMethodsByAccountId } from '../redux/slices/recoveryMethods';
import { wallet } from '../utils/wallet';

const { fetchRecoveryMethods } = recoveryMethodsActions;

const empty = [];

export function useRecoveryMethods(accountId) {
    const recoveryMethods = useSelector(state =>
        selectRecoveryMethodsByAccountId(state, { accountId })
    );

    const dispatch = useDispatch();

    useEffect(() => {
        if (accountId === wallet.accountId) {
            dispatch(fetchRecoveryMethods({ accountId }));
        }
    }, [accountId]);

    return recoveryMethods || empty;
}
