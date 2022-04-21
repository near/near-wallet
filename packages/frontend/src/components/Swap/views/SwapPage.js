import React, { useCallback, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch } from 'react-redux';

import { useFetchByorSellUSN } from '../../../hooks/fetchByorSellUSN';
import { showCustomAlert } from '../../../redux/actions/status';
import { actions as ledgerActions } from '../../../redux/slices/ledger';
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

const { checkAndHideLedgerModal } = ledgerActions;

const balanceForError = (from) => {
    return from?.onChainFTMetadata?.symbol === 'NEAR'
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
    const [isSwapped, setIsSwapped] = useState(false);
    const [slippageValue, setSlippageValue] = useState(1);
    const [usnAmount, setUSNAmount] = useState('');
    const { commissionFee, isLoadingCommission } = commission({
        accountId,
        amount: inputValueFrom,
        delay: 500,
        exchangeRate: + multiplier,
        token: from,
        isSwapped,
    });
    const { fetchByOrSell, isLoading, setIsLoading } = useFetchByorSellUSN();
    const dispatch = useDispatch();
    const balance = balanceForError(from);
    const error = balance < +inputValueFrom || !inputValueFrom;
    const slippageError = slippageValue < 1 || slippageValue > 50;

    const onHandleSwapTokens = useCallback(async (accountId, multiplier, slippageValue, inputValueFrom, symbol, usnAmount) => {
        try {
            setIsLoading(true);
            await fetchByOrSell(accountId, multiplier, slippageValue, +inputValueFrom, symbol, usnAmount);
            setActiveView('success');
        } catch (e) {
            dispatch(showCustomAlert({
                errorMessage: e.message,
                success: false,
                messageCodeHeader: 'error',
            }));
        } finally {
            setIsLoading(false);
            dispatch(checkAndHideLedgerModal());
        }
    }, []);

    return (
        <>
            <Loader onRefreshMultiplier={() => dispatch(fetchMultiplier())}/>
            <h1>
                <Translate id="button.swap"/>
            </h1>
            <SwapTokenContainer
                text="swap.from"
                fromToToken={from}
                value={inputValueFrom}
                setInputValueFrom={setInputValueFrom}
            />
            <AvailableToSwap
                onClick={(balance) => {
                    setInputValueFrom(balance);
                    from?.onChainFTMetadata?.symbol === 'USN' && setUSNAmount(from?.balance);
                }}
                balance={from?.balance}
                symbol={from?.onChainFTMetadata?.symbol}
                decimals={from?.onChainFTMetadata?.decimals}
            />
            <div
                className="iconSwap"
                onClick={() => {
                    onSwap();
                    setIsSwapped((prev) => !prev);
                }}
            >
                <SwapIconTwoArrows
                    width="23"
                    height="23"
                    color="#72727A"
                />
            </div>
            <SwapTokenContainer
                text="swap.to"
                fromToToken={to}
                multiplier={multiplier}
                value={inputValueFrom}
            />
            <SwapInfoContainer
                slippageError={slippageError}
                slippageValue={slippageValue}
                setSlippageValue={setSlippageValue}
                token={from?.onChainFTMetadata?.symbol}
                exchangeRate={+multiplier / 10000}
                amount={inputValueFrom}
                tradingFee={commissionFee?.result}
                isLoading={isLoadingCommission}
                percent={commissionFee?.percent}
            />
            <div className="buttons-bottom-buttons">
                <FormButton
                    type="submit"
                    disabled={error || slippageError || isLoading}
                    data-test-id="sendMoneyPageSubmitAmountButton"
                    onClick={() => onHandleSwapTokens(accountId, multiplier, slippageValue, +inputValueFrom, from?.onChainFTMetadata?.symbol, usnAmount)}
                    sending={isLoading}
                >
                    <Translate id="button.swap"/>
                </FormButton>
                <FormButton
                    type="button"
                    className="link"
                    color="gray"
                    linkTo="/"
                >
                    <Translate id="button.cancel"/>
                </FormButton>
            </div>
        </>
    );
};

export default SwapPage;
