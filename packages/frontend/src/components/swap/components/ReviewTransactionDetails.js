import * as nearApiJs from 'near-api-js';
import React from 'react';
import { Translate } from 'react-localize-redux';
import { withRouter } from 'react-router';
import styled from 'styled-components';

import { removeTrailingZeros } from '../../../utils/amounts';
import Token from '../../send/components/entry_types/Token';
import SwapIcon from '../../svg/WrapIcon';
import TransactionDetails from './TransactionDetails';

const {
    utils: {
        format: { parseNearAmount },
    },
} = nearApiJs;

const ReviewForm = styled.div`
    display: flex;
    flex-direction: column;
    margin: 34px 0 0 0;
    padding: 8px 16px 16px;

    div.flex {
        display: flex;
        &.center {
            justify-content: center;
        }
        &.space-between {
            justify-content: space-between;
        }
        align-items: center;
        &.add-padding {
            padding: 16px;
        }
        &.margin {
            margin: 13px;
        }
        &.height {
            height: 60px;
        }
        &.rotate {
            transform: rotate(180deg);
        }
    }
    div.flexCenter {
        display: flex;
        justify-content: center;
        margin: 16px;
    }
    div.margin-right {
        margin-right: 10px;
    }
    div.bg {
        background-color: #f8f9fa;
        &.radius {
            border-radius: 8px;
        }
        &.first {
            border-radius: 8px 8px 0 0;
        }
        &.last {
            border-radius: 0 0 8px 8px;
            cursor: pointer;
        }
        &.index {
            z-index: -10;
        }
    }
    div.dark-bg {
        height: 60px;
        background-color: #eceef0;
        &.border {
            border-top: 1px solid #dfe3e6;
            border-bottom: 1px solid #dfe3e6;
        }
    }

    div.height60 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 4px;
        height: 60px;
        padding: 16px;
    }

    div.title {
        margin-left: 15px;
        color: #787f85;
    }

    h2 {
        margin-left: 16px;
        font-family: "Inter";
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 32px;
        color: #11181c;
    }
    swg.small {
        width: 15px;
        height: 15px;
    }
    .green div {
        font-family: "Inter";
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        color: #5bb98c;
    }

    .details-info div {
        @media screen and (max-width: 400px) {
            font-size: 14px;
        }
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

const ReviewTransactionDetails = ({
    amountTokenFrom,
    amountTokenTo,
    tokenFrom,
    tokenTo,
    setSlippageValue,
    exchangeRate,
    tradingFee
}) => {
    let estimatedMinReceived = '';
    try {
        estimatedMinReceived = parseNearAmount(amountTokenTo.toString());
    } catch {
        console.log('error parseNearAmount');
    }

    const ratio = () => {
        const ratio = amountTokenFrom/amountTokenTo;
        const isAFraction = !!(ratio % 1);
        return isAFraction
            ? (ratio).toFixed(5)
            : removeTrailingZeros((ratio).toString());
    };

    return (
        <ReviewForm>
            <div className="flex space-between bg radius">
                <h2
                    style={{
                        fontSize: `${
                            amountTokenFrom.length
                                ? getFontSize(amountTokenFrom.length)
                                : 24
                        }px`,
                    }}
                >
                    {!!(amountTokenFrom % 1)
                        ? removeTrailingZeros(amountTokenFrom)
                        : amountTokenFrom}
                </h2>
                <Token
                    symbol={tokenFrom.onChainFTMetadata?.symbol}
                    icon={tokenFrom.onChainFTMetadata?.icon}
                />
            </div>
            <div className="flexCenter">
                <SwapIcon color="#C1C8CD" />
            </div>
            <div className="flex space-between bg radius">
                <h2
                    style={{
                        fontSize: `${
                            amountTokenFrom.length
                                ? getFontSize(amountTokenFrom.length)
                                : 24
                        }px`,
                    }}
                >
                    {!!(amountTokenTo % 1)
                        ? removeTrailingZeros(amountTokenTo)
                        : amountTokenTo}
                </h2>
                <Token
                    symbol={tokenTo.onChainFTMetadata?.symbol}
                    icon={tokenTo.onChainFTMetadata?.icon}
                />
            </div>
            <div className="bg height60 first index">
                <Translate id="swapNear.price" />
                <div>{`${ratio()} ${tokenFrom.onChainFTMetadata?.symbol} per ${
                    tokenTo.onChainFTMetadata?.symbol
                }`}</div>
            </div>
            <TransactionDetails
                selectedTokenFrom={tokenFrom}
                selectedTokenTo={tokenTo}
                estimatedFeesInNear={`${
                    amountTokenFrom > 1
                        ? Math.trunc(amountTokenFrom).toString()
                        : '1'
                }`}
                estimatedMinReceived={estimatedMinReceived}
                amount={amountTokenFrom}
                exchangeRate={exchangeRate}
                tradingFee={tradingFee}
                setSlippageValue={setSlippageValue}
            />
        </ReviewForm>
    );
};

export default withRouter(ReviewTransactionDetails);
