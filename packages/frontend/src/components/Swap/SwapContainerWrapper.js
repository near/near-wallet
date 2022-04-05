import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useFungibleTokensIncludingNEAR } from '../../hooks/fungibleTokensIncludingNEAR';
import { selectAccountId } from '../../redux/slices/account';
import { fetchMultiplier, selectMetadataSlice } from '../../redux/slices/multiplier';
import { selectSwapBycontractName } from '../../redux/slices/swap';
import { VIEWS_SWAP } from './SwapAndSuccessContainer';
import { actions as tokensActions } from "../../redux/slices/tokens";
import SwapAndSuccessContainer from './SwapAndSuccessContainer';
import { useFetchByorSellUSN } from '../../hooks/fetchByorSellUSN';
import { showCustomAlert } from '../../redux/actions/status';
import { refreshAccount } from '../../redux/actions/account';



const { fetchTokens } = tokensActions;

const SwapContainerWrapper = () => {
    const fungibleTokensList = useFungibleTokensIncludingNEAR();
    const accountId = useSelector((state) => selectAccountId(state));
    const miltiplier = useSelector(selectMetadataSlice);
    const dispatch = useDispatch();
    const swapContractValue = useSelector(selectSwapBycontractName)
    const [activeView, setActiveView] = useState(VIEWS_SWAP.MAIN);
    const { fetchByOrSell, isLoading, setIsLoading } = useFetchByorSellUSN();
        

    useEffect(() => {
        if(!accountId) {
            return;
        }

        dispatch(fetchTokens({ accountId }));
        dispatch(fetchMultiplier());
    }, [accountId]);

  return (
    <SwapAndSuccessContainer
        onRefreshMultiplier={() => dispatch(fetchMultiplier())}
        fungibleTokensList={fungibleTokensList}
        accountId={accountId}
        miltiplier={miltiplier}
        swapContractValue={swapContractValue}
        activeView={activeView}
        isLoading={isLoading}
        handleSwapToken={async (slipPage, amount, symbol, USNamount) => {
            try {
                setIsLoading(true)
                await fetchByOrSell(accountId,miltiplier,slipPage,amount,symbol,USNamount)
                setActiveView(VIEWS_SWAP.SUCCESS)
            } catch (e) {
                dispatch(showCustomAlert({
                    errorMessage: e.message,
                    success: false,
                    messageCodeHeader: 'error',
                }));
            } finally {
                setIsLoading(false)
            }
        }}
        handleBackToSwap={async () => {
            await dispatch(refreshAccount())
            await dispatch(fetchTokens({ accountId }));
            setActiveView(VIEWS_SWAP.MAIN)
        }}
    />
  )
}

export default SwapContainerWrapper