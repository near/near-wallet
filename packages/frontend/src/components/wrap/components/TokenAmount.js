import React from 'react';

import { formatTokenAmount, removeTrailingZeros } from '../../../utils/amounts';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

const StyledContainer = styled.div`
    .dots {
        color: #4a4f54;
        margin: 0 12px 0 0;

        :after {
            content: '.';
            animation: link 1s steps(5, end) infinite;

            @keyframes link {
                0%, 20% {
                    color: rgba(0,0,0,0);
                    text-shadow:
                        .3em 0 0 rgba(0,0,0,0),
                        .6em 0 0 rgba(0,0,0,0);
                }
                40% {
                    color: #4a4f54;
                    text-shadow:
                        .3em 0 0 rgba(0,0,0,0),
                        .6em 0 0 rgba(0,0,0,0);
                }
                60% {
                    text-shadow:
                        .3em 0 0 #4a4f54,
                        .6em 0 0 rgba(0,0,0,0);
                }
                80%, 100% {
                    text-shadow:
                        .3em 0 0 #4a4f54,
                        .6em 0 0 #4a4f54;
                }
            }
        }
    }
`;




const FRAC_DIGITS = 5;

const amountWithCommas = (amount) => {
    var parts = amount.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

const formatToken = (amount, decimals) => {
    if (amount === '0') {
        return amount;
    }

    let formattedAmount = formatTokenAmount(amount, decimals, FRAC_DIGITS);

    if (formattedAmount === `0.${'0'.repeat(FRAC_DIGITS)}`) {
        return `< ${!FRAC_DIGITS ? `0` : `0.${'0'.repeat((FRAC_DIGITS || 1) - 1)}1`}`;
    }
    return amountWithCommas(removeTrailingZeros(formattedAmount));
};

const showFullAmount = (amount, decimals, symbol) =>
    (amount !== '0' && !!amount)
        ? `${formatTokenAmount(amount, decimals, decimals)} ${symbol}`
        : '';

const TokenAmount = ({ token: { balance, decimals, symbol }, testId, withSymbol = false, className, showFiatAmount = true }) => (
    <StyledContainer className={className} title={showFullAmount(balance, decimals, symbol)} data-test-id={testId} >
        <div >
            {balance
                ? (
                    <>
                        {formatToken(balance, decimals)}
                        < span className='currency'>{withSymbol ? ` ${symbol}` : null}</span>
                    </>
                )
                : <div className="dots"><Translate id='loadingNoDots' /></div>
            }
        </div>
        {
            showFiatAmount &&
            <div className='fiat-amount'>
                — USD
            </div>
        }
    </StyledContainer >
);

export default TokenAmount;
