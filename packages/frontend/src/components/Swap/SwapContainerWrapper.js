<<<<<<< HEAD
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useFungibleTokensIncludingNEAR } from '../../hooks/fungibleTokensIncludingNEAR';
import { selectAccountId } from '../../redux/slices/account';
import { fetchMultiplier, selectMetadataSlice } from '../../redux/slices/multiplier';
import { actions as tokensActions } from "../../redux/slices/tokens";
=======
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFungibleTokensIncludingNEAR } from '../../hooks/fungibleTokensIncludingNEAR';
import { selectAccountId } from '../../redux/slices/account';
import { fetchMultiplier, selectMetadataSlice } from '../../redux/slices/multiplier';
import { actions as tokensActions } from '../../redux/slices/tokens';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
import SwapAndSuccessContainer from './SwapAndSuccessContainer';

const { fetchTokens } = tokensActions;

const SwapContainerWrapper = () => {
    const fungibleTokensList = useFungibleTokensIncludingNEAR();
    const accountId = useSelector((state) => selectAccountId(state));
    const multiplier = useSelector(selectMetadataSlice);
    const dispatch = useDispatch();
   
    useEffect(() => {
<<<<<<< HEAD
        if(!accountId) {
=======
        if (!accountId) {
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
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
<<<<<<< HEAD
  )
}

export default SwapContainerWrapper
=======
  );
};

export default SwapContainerWrapper;
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
