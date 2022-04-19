<<<<<<< HEAD
import React, { useCallback, useState } from 'react'
import { Translate } from 'react-localize-redux'
import { useDispatch } from 'react-redux'
import { useFetchByorSellUSN } from '../../../hooks/fetchByorSellUSN'
import { showCustomAlert } from '../../../redux/actions/status'
import { fetchMultiplier } from '../../../redux/slices/multiplier'
import { formatTokenAmount } from '../../../utils/amounts'
import { formatNearAmount } from '../../common/balance/helpers'
import FormButton from '../../common/FormButton'
import SwapIconTwoArrows from '../../svg/SwapIconTwoArrows'
import AvailableToSwap from '../AvailableToSwap'
import { commission } from '../helpers'
import Loader from '../Loader'
import SwapInfoContainer from '../SwapInfoContainer'
import SwapTokenContainer from '../SwapTokenContainer'

const balanceForError = (from) => {
    return from?.onChainFTMetadata?.symbol === "NEAR"
=======
import React, { useCallback, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch } from 'react-redux';

import { useFetchByorSellUSN } from '../../../hooks/fetchByorSellUSN';
import { showCustomAlert } from '../../../redux/actions/status';
import { fetchMultiplier } from '../../../redux/slices/multiplier';
import { formatTokenAmount } from '../../../utils/amounts';
import { formatNearAmount } from '../../common/balance/helpers';
import FormButton from '../../common/FormButton';
import SwapIconTwoArrows from '../../svg/SwapIconTwoArrows';
import AvailableToSwap from '../AvailableToSwap';
import { commission } from '../helpers';
import Loader from '../Loader';
import SwapInfoContainer from '../SwapInfoContainer';
import SwapTokenContainer from '../SwapTokenContainer';

const balanceForError = (from) => {
    return from?.onChainFTMetadata?.symbol === 'NEAR'
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
        ? +formatNearAmount(from?.balance)
        : +formatTokenAmount(from?.balance, from?.onChainFTMetadata?.decimals, 5);
};

const SwapPage = ({
    from,
    to,
    inputValueFrom,
    setInputValueFrom,
    multiplier,
    accountId,
    onSwap,
    setActiveView
}) => {
<<<<<<< HEAD
    const [isSwaped, setIsSwaped] = useState(false)
    const [slippPageValue, setSlippPageValue] = useState(1);
    const [USNamount, setUSNamount] = useState('')
    const {commissionFree, isLoadingCommission} = commission(accountId, inputValueFrom, 500, +multiplier, from, isSwaped)
    const { fetchByOrSell, isLoading, setIsLoading } = useFetchByorSellUSN();
    const dispatch = useDispatch()
    const balance = balanceForError(from);
    const error = balance < +inputValueFrom || !inputValueFrom
=======
    const [isSwaped, setIsSwaped] = useState(false);
    const [slippPageValue, setSlippPageValue] = useState(1);
    const [USNamount, setUSNamount] = useState('');
    const {commissionFree, isLoadingCommission} = commission(accountId, inputValueFrom, 500, +multiplier, from, isSwaped);
    const { fetchByOrSell, isLoading, setIsLoading } = useFetchByorSellUSN();
    const dispatch = useDispatch();
    const balance = balanceForError(from);
    const error = balance < +inputValueFrom || !inputValueFrom;
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
    const splpPageError = slippPageValue < 1 || slippPageValue > 50;

    const onHandleSwapTokens = useCallback(async (accountId, multiplier, slippPageValue, inputValueFrom, symbol, USNamount) => {
        try {
<<<<<<< HEAD
            setIsLoading(true)
            await fetchByOrSell(accountId, multiplier, slippPageValue, +inputValueFrom, symbol, USNamount)
            setActiveView('success')
=======
            setIsLoading(true);
            await fetchByOrSell(accountId, multiplier, slippPageValue, +inputValueFrom, symbol, USNamount);
            setActiveView('success');
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
        } catch (e) {
            dispatch(showCustomAlert({
                errorMessage: e.message,
                success: false,
                messageCodeHeader: 'error',
            }));
        } finally {
<<<<<<< HEAD
            setIsLoading(false)
        }
    },[]) 
=======
            setIsLoading(false);
        }
    },[]); 
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
   
  return (
    <>
        <Loader onRefreshMultiplier={() => dispatch(fetchMultiplier())}/>
         <h1>
            <Translate id="button.swap" />
        </h1>
        <SwapTokenContainer
            text="swap.from"
            fromTotoken={from}
            value={inputValueFrom}
            setInputValueFrom={setInputValueFrom}
        />
        <AvailableToSwap
<<<<<<< HEAD
            onClick={(balance) => {setInputValueFrom(balance); from?.onChainFTMetadata?.symbol === 'USN' && setUSNamount(from?.balance)}}
=======
            onClick={(balance) => {setInputValueFrom(balance); from?.onChainFTMetadata?.symbol === 'USN' && setUSNamount(from?.balance);}}
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
            balance={from?.balance}
            symbol={from?.onChainFTMetadata?.symbol}
            decimals={from?.onChainFTMetadata?.decimals}
        />
        <div
            className="iconSwap"
<<<<<<< HEAD
            onClick={() => {onSwap(); setIsSwaped(prev => !prev)}} 
=======
            onClick={() => {onSwap(); setIsSwaped((prev) => !prev);}} 
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
        >
            <SwapIconTwoArrows
                width="23"
                height="23"
                color="#72727A"
            />
        </div>
        <SwapTokenContainer
            text="swap.to"
            fromTotoken={to}
            muliplier={multiplier}
            value={inputValueFrom}
        />
        <SwapInfoContainer
            slipPageError={splpPageError}
            slippPageValue={slippPageValue}
            setSlippPageValue={setSlippPageValue}
            token={from?.onChainFTMetadata?.symbol}
            exchngeRate={+multiplier / 10000}
            amount={inputValueFrom}
            tradinFree={commissionFree?.result}
            isLoading={isLoadingCommission}
            percent={commissionFree?.percent}
        />
        <div className="buttons-bottom-buttons">
            <FormButton
                type="submit"
                disabled={error || splpPageError || isLoading}
                data-test-id="sendMoneyPageSubmitAmountButton"
                onClick={() => onHandleSwapTokens(accountId, multiplier, slippPageValue, +inputValueFrom, from?.onChainFTMetadata?.symbol, USNamount)}
                sending={isLoading}
            >
                <Translate id="button.continue" />
            </FormButton>
            <FormButton
                type="button"
                className="link"
                color="gray"
                linkTo="/"
            >
                <Translate id="button.cancel" />
            </FormButton>
        </div>
    </>
<<<<<<< HEAD
  ) 
}

export default SwapPage
=======
  ); 
};

export default SwapPage;
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
