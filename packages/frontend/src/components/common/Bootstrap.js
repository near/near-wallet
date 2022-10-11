import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import useInterval from '../../hooks/useInterval';
import { selectAccountId } from '../../redux/slices/account';
import { actions as swapActions } from '../../redux/slices/swap';
import { actions as tokensActions } from '../../redux/slices/tokens';

const { fetchSwapData } = swapActions;
const { fetchTokens } = tokensActions;

const ONE_MINUTE = 60_000;

export default function Bootstrap() {
    const dispatch = useDispatch();
    const accountId = useSelector(selectAccountId);

    useEffect(() => {
        if (accountId) {
            dispatch(fetchTokens({ accountId }));
        }
    }, [accountId]);

    useInterval(
        () => {
            if (accountId) {
                dispatch(fetchSwapData({ accountId }));
            }
        },
        ONE_MINUTE,
        [accountId]
    );

    return null;
};
