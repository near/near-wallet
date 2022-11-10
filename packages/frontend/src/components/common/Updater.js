import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import useInterval from '../../hooks/useInterval';
import { selectAccountId } from '../../redux/slices/account';
import { actions as swapActions } from '../../redux/slices/swap';
import { actions as tokenFiatValuesActions } from '../../redux/slices/tokenFiatValues';
import { actions as tokensActions } from '../../redux/slices/tokens';

const { fetchTokenFiatValues } = tokenFiatValuesActions;
const { fetchTokens } = tokensActions;
const { fetchSwapData } = swapActions;

const THIRTY_SECONDS = 30_000;
const ONE_MINUTE = THIRTY_SECONDS * 2;

export default function Updater() {
    const dispatch = useDispatch();
    const accountId = useSelector(selectAccountId);

    useEffect(() => {
        if (accountId) {
            dispatch(fetchTokens({ accountId }));
        }
    }, [accountId]);

    useInterval(() => {
        dispatch(fetchTokenFiatValues());
    }, THIRTY_SECONDS);

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
}
