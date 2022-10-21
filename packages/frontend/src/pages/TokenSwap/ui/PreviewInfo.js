import React from 'react';
import { withRouter } from 'react-router';
import styled from 'styled-components';

import SkeletonLoading from '../../../components/common/SkeletonLoading';
import Token from '../../../components/send/components/entry_types/Token';
import SwapIcon from '../../../components/svg/WrapIcon';
import { removeTrailingZeros } from '../../../utils/amounts';
import SwapDetails from './SwapDetails/SwapDetails';

const Preview = styled.div`
    display: flex;
    flex-direction: column;
    margin: 34px 0 0 0;
    padding: 8px 16px 16px;

    .flexCenter {
        display: flex;
        justify-content: center;
        margin: 16px;
    }

    h2 {
        margin-left: 16px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 32px;
        color: #11181c;
    }
`;

const TokenRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.5rem;
    background-color: #f8f9fa;
`;

const DetailsWrapper = styled.div`
    margin-top: 0.4rem;
`;

const getFontSize = (charLength) => {
    let baseSize = 24;

    if (charLength > 10) {
        baseSize = 20;
    }

    if (charLength >= baseSize) {
        baseSize = 16;
    }

    return baseSize;
};

const formatTitleAmount = (amount) => {
    const hasDecimals = amount % 1;

    return hasDecimals ? removeTrailingZeros(amount) : amount;
};

const LoaderWrapper = styled.div`
    padding: 2.5rem 0.625rem 0.625rem;
    max-width: 31.25rem;
    margin: 0 auto;

    .animation {
        border-radius: 0.5rem;
    }
`;

export default withRouter(function PreviewInfo({
    tokenFrom,
    amountTokenFrom,
    tokenTo,
    amountTokenTo,
}) {
    if (!tokenFrom || !tokenTo) {
        return (
            <LoaderWrapper>
                <SkeletonLoading height='6.375rem' show />
            </LoaderWrapper>
        );
    }

    const titleStyle = {
        fontSize: `${
            amountTokenFrom.length ? getFontSize(amountTokenFrom.length) : 24
        }px`,
    };

    return (
        <Preview>
            <TokenRow>
                <h2 style={titleStyle}>{formatTitleAmount(amountTokenFrom)}</h2>
                <Token
                    symbol={tokenFrom?.onChainFTMetadata?.symbol}
                    icon={tokenFrom?.onChainFTMetadata?.icon}
                />
            </TokenRow>
            <div className='flexCenter'>
                <SwapIcon color='#C1C8CD' />
            </div>
            <TokenRow>
                <h2 style={titleStyle}>{formatTitleAmount(amountTokenTo)}</h2>
                <Token
                    symbol={tokenTo?.onChainFTMetadata?.symbol}
                    icon={tokenTo?.onChainFTMetadata?.icon}
                />
            </TokenRow>
            <DetailsWrapper>
                <SwapDetails />
            </DetailsWrapper>
        </Preview>
    );
});
