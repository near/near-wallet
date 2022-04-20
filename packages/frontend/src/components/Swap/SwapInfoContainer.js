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

function formatAmount({ amount, symbol, tradinFree, value }) {
    if (!amount && !tradinFree) {
        return `${amount} ${symbol}`;
    }

    if (!tradinFree) {
        return `- ${symbol}`;
    }

    return `${value} ${symbol}`;
}

function SwapInfoContainer({
   exchangeRate,
   amount,
   token,
   setSlippPageValue,
   slippPageValue,
   slipPageError,
   tradinFree,
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
                slipPageError={slipPageError}
                slippPageValue={slippPageValue}
                setSlippPageValue={setSlippPageValue}
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
                    tradinFree,
                    value: `${percent}% / ${tradinFree?.toFixed(5)}`,
                })}
            />
            <SwapInfoItem
                isDots={isLoading}
                leftText={'swap.MinimumReceived'}
                rightText={formatAmount({
                    amount,
                    symbol,
                    tradinFree,
                    value: MinimumReceived({ token: symbol, balance: amount, exchangeRate }) - tradinFree,
                })}
            />
        </StyledContainer>
    );
}

export default SwapInfoContainer;
