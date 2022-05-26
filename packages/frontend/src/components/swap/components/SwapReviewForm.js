import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { removeTrailingZeros } from '../../../utils/amounts';
import BackArrowButton from '../../common/BackArrowButton';
import FormButton from '../../common/FormButton';
import { VIEWS } from '../Swap';
import ReviewTransactionDetails from './ReviewTransactionDetails';

const StyledContainer = styled.div`
    h4 {
        font-family: "Inter";
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;
        text-align: center;
        font-weight: 900;
        margin: auto;
    }
    div.header {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }
    div.flexCenter {
        display: flex;
        justify-content: center;
    }
    div.flexCenterColumn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    div.flexCenterButton {
        display: flex;
        justify-content: center;
        margin-top: 28px;
    }
    .width100 {
        width: 100%;
    }
`;

const getFontSize = (charLength) => {
    let baseSize = 24;

    if (charLength > 5) {
        baseSize = 24;
    }

    if (charLength > 10) {
        baseSize = 20;
    }

    if (charLength >= baseSize) {
        baseSize = 16;
    }
    const fontSize = baseSize;
    return fontSize;
};

export function SwapReviewForm({
    setActiveView,
    amountTokenFrom,
    amountTokenTo,
    activeTokenFrom,
    activeTokenTo,
    accountId,
    handleSwapToken,
    swappingToken,
    setSlippage,
    exchangeRate,
    tradingFee
}) {
    return (
        <StyledContainer>
            <div className="header">
                <BackArrowButton
                    onClick={() => setActiveView(VIEWS.SWAP_AMOUNT)}
                />
                <h4>
                    <Translate id="swap.reviewInfo" />
                </h4>
            </div>
            <div className="flexCenterColumn">
                <h1
                    style={{
                        fontSize: `${
                            amountTokenFrom.length
                                ? getFontSize(amountTokenFrom.length)
                                : 24
                        }px`,
                    }}
                >{`${
                    !!(amountTokenFrom % 1)
                        ? removeTrailingZeros(amountTokenFrom)
                        : amountTokenFrom
                } ${activeTokenFrom.onChainFTMetadata?.symbol}`}</h1>
                <div>{`≈ ${(
                    amountTokenFrom * activeTokenFrom.fiatValueMetadata.usd
                ).toFixed(2)} USD`}</div>
            </div>
            <ReviewTransactionDetails
                amountTokenFrom={amountTokenFrom}
                amountTokenTo={amountTokenTo}
                tokenFrom={activeTokenFrom}
                tokenTo={activeTokenTo}
                exchangeRate={exchangeRate}
                setSlippage={setSlippage}
                tradingFee={tradingFee}
            />
            <FormButton
                color="blue width100"
                disabled={swappingToken === true}
                sending={swappingToken === true}
                sendingString="swapping"
                onClick={async () => {
                    await handleSwapToken({
                        accountId,
                        amount: amountTokenFrom.toString(),
                        tokenFrom: activeTokenFrom.onChainFTMetadata?.symbol,
                        tokenTo: activeTokenTo.onChainFTMetadata?.symbol
                    });
                }}
            >
                <Translate id="swap.confirm" />
            </FormButton>
            <div className="flexCenterButton">
                <FormButton
                    color="gray link"
                    onClick={() => setActiveView(VIEWS.SWAP_AMOUNT)}
                >
                    <Translate id="button.cancel" />
                </FormButton>
            </div>
        </StyledContainer>
    );
}
