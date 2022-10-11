import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { removeTrailingZeros } from '../../../utils/amounts';
import BackArrowButton from '../../common/BackArrowButton';
import FormButton from '../../common/FormButton';
import TransactionDetails from './TransactionDetails';

const StyledContainer = styled.div`
    h4 {
        font-family: "Inter";
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;
        text-align: center;
        font-weight: 700;
        margin: auto;
        white-space: nowrap;
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
    onClickGoBack,
    amountTokenFrom,
    amountTokenTo,
    minReceivedAmount,
    activeTokenFrom,
    activeTokenTo,
    accountId,
    handleSwapToken,
    swappingToken,
    setSlippage,
    swapFee,
    swapFeeAmount,
    estimatedFee,
    priceImpactElement,
    showAllInfo,
}) {
    const tokenFromFiatPrice = activeTokenFrom?.fiatValueMetadata?.usd;
    const tokenFromFiatAmount = tokenFromFiatPrice ? amountTokenFrom * tokenFromFiatPrice : null;

    return (
        <StyledContainer>
            <div className="header">
                <BackArrowButton
                    onClick={onClickGoBack}
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
                {tokenFromFiatAmount && (
                    <div>{`≈ ${(
                        amountTokenFrom * activeTokenFrom.fiatValueMetadata.usd
                    ).toFixed(2)} USD`}</div>
                )}
            </div>
            <TransactionDetails
                amountTokenFrom={amountTokenFrom}
                amountTokenTo={amountTokenTo}
                minReceivedAmount={minReceivedAmount}
                tokenFrom={activeTokenFrom}
                tokenTo={activeTokenTo}
                setSlippage={setSlippage}
                swapFee={swapFee}
                swapFeeAmount={swapFeeAmount}
                estimatedFee={estimatedFee}
                priceImpactElement={priceImpactElement}
                showAllInfo={showAllInfo}
            />
            <FormButton
                color="blue width100"
                disabled={swappingToken === true}
                sending={swappingToken === true}
                sendingString="swapping"
                data-test-id="swapPageStartSwapButton"
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
                    onClick={onClickGoBack}
                >
                    <Translate id="button.cancel" />
                </FormButton>
            </div>
        </StyledContainer>
    );
}
