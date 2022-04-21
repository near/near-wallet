import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFungibleTokensIncludingNEAR } from '../../hooks/fungibleTokensIncludingNEAR';
import { selectAccountId } from '../../redux/slices/account';
import { fetchMultiplier, selectMetadataSlice } from '../../redux/slices/multiplier';
import { actions as tokensActions } from '../../redux/slices/tokens';
import SwapAndSuccessContainer from './SwapAndSuccessContainer';

const { fetchTokens } = tokensActions;

const SwapContainerWrapper = () => {
    const fungibleTokensList = useFungibleTokensIncludingNEAR();
    const accountId = useSelector((state) => selectAccountId(state));
    const multiplier = useSelector(selectMetadataSlice);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!accountId) {
            return;
        }

        dispatch(fetchTokens({ accountId }));
        dispatch(fetchMultiplier());
    }, [accountId]);

    return (
        <SwapAndSuccessContainer
            fungibleTokensList={fungibleTokensList}
            accountId={accountId}
            multiplier={multiplier}
        />
    );
};

export default SwapContainerWrapper;
