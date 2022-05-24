import React from 'react';
import styled from 'styled-components';

import { MinimumReceived } from './helpers';
import SwapInfoItem from './SwapInfoItem';

const pairPrice = (isNear, exchangeRate) => {
    const price = isNear ? 1 * exchangeRate : 1 / exchangeRate;
    return price?.toFixed(5);
};

const StyledContainer = styled.div`
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
`;

function formatAmount({ amount, symbol, tradingFee, value }) {
    if (!amount && !tradingFee) {
        return `${amount} ${symbol}`;
    }

    if (!tradingFee) {
        return `- ${symbol}`;
    }

    return `${value} ${symbol}`;
}

function SwapInfoContainer({
   exchangeRate,
   amount,
   token,
   setSlippageValue,
   slippageValue,
   slippageError,
   tradingFee,
   isLoading,
   percent
}) {
    const isNear = token === 'NEAR';
    const expectedPrice = isNear
        ? +amount * exchangeRate
        : +amount / exchangeRate;
    const symbol = !isNear ? 'NEAR' : 'USN';

    return (
        <StyledContainer>
            <SwapInfoItem
                leftText="swap.slipPage"
                slippageError={slippageError}
                slippageValue={slippageValue}
                setSlippageValue={setSlippageValue}
            />
            <SwapInfoItem
                leftText={'swap.pairPrice'}
                rightText={`1 ${isNear ? 'NEAR' : 'USN'} = ${pairPrice(isNear, exchangeRate)} ${symbol}`}
            />
            <SwapInfoItem
                leftText={'swap.ExpectedPrice'}
                rightText={`${amount} ${token} = ${expectedPrice?.toFixed(5)} ${symbol}`}
            />
            <SwapInfoItem
                isDots={isLoading}
                leftText={'swap.TradingFee'}
                rightText={formatAmount({
                    amount,
                    symbol,
                    tradingFee,
                    value: `${percent}% / ${tradingFee?.toFixed(5)}`, // todo: get clarification
                })}
            />
            <SwapInfoItem
                isDots={isLoading}
                leftText={'swap.MinimumReceived'}
                rightText={formatAmount({
                    amount,
                    symbol,
                    tradingFee,
                    value: MinimumReceived({ token: symbol, balance: amount, exchangeRate }) - tradingFee, // todo: get clarification
                })}
            />
        </StyledContainer>
    );
}

export default SwapInfoContainer;
