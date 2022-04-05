import React, { useState } from 'react'
import { Translate } from 'react-localize-redux'
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
        ? +formatNearAmount(from?.balance)
        : +formatTokenAmount(from?.balance, from?.onChainFTMetadata?.decimals, 5);
};

const SwapPage = ({
    from,
    to,
    inputValueFrom,
    setInputValueFrom,
    miltiplier,
    slippPageValue,
    setSlippPageValue,
    accountId,
    isLoading,
    onClickContinue,
    onSwap,
    setUSNamount,
    onRefreshMultiplier
}) => {
    const [isSwaped, setIsSwaped] = useState(false)
    const {commissionFree, isLoadingCommission} = commission(accountId, inputValueFrom, 500, +miltiplier, from, isSwaped)

    const balance = balanceForError(from);
    const error = balance < +inputValueFrom;
    const splpPageError = slippPageValue < 1 || slippPageValue > 50;

  return (
    <>
        <Loader onRefreshMultiplier={() => onRefreshMultiplier()}/>
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
            onClick={(balance) => {setInputValueFrom(balance); from?.onChainFTMetadata?.symbol === 'USN' && setUSNamount(from?.balance)}}
            balance={from?.balance}
            symbol={from?.onChainFTMetadata?.symbol}
            decimals={from?.onChainFTMetadata?.decimals}
        />
        <div
            className="iconSwap"
            onClick={() => {onSwap(); setIsSwaped(prev => !prev)}} 
        >
            <SwapIconTwoArrows
                width={"20"}
                height="20"
                color="#3070C6"
            />
        </div>
        <SwapTokenContainer
            text="swap.to"
            fromTotoken={to}
            muliplier={miltiplier}
            value={inputValueFrom}
        />
        <SwapInfoContainer
            slipPageError={splpPageError}
            slippPageValue={slippPageValue}
            setSlippPageValue={setSlippPageValue}
            token={from?.onChainFTMetadata?.symbol}
            exchngeRate={+miltiplier / 10000}
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
                onClick={onClickContinue}
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
  ) 
}

export default SwapPage