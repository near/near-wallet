import React from 'react';
import { Translate } from 'react-localize-redux';

import Tooltip from '../../common/Tooltip';
import RawTokenAmount from './RawTokenAmount';
import StyledContainer from './css/Style.css';
import TokenIcon from './TokenIcon';
import styled from 'styled-components';

const AmountIconContainer = styled.div`
    display: flex;
    align-items: center;
    > div {
        margin: 0 5px;
    }
`;

const AmountWithIcon = ({
    className,
    symbol,
    amount,
    decimals,
    icon,
    translateIdTitle,
    translateIdInfoTooltip,
    "data-test-id": testId
}) => {
    /* TODO: Handle long amounts */
    return (
        <StyledContainer className={className} data-test-id={testId}>
            <Translate id={translateIdTitle} />
            {translateIdInfoTooltip &&
                <Tooltip translate={translateIdInfoTooltip} />
            }
            <AmountIconContainer>
                <div className='amount'>
                    <RawTokenAmount
                        symbol={symbol}
                        amount={amount}
                        decimals={decimals}
                        showFiatAmountForNonNearToken={false}
                    />
                </div>
                <div className='icon'>
                    <span><TokenIcon symbol={symbol} icon={icon} /></span>
                </div>
            </AmountIconContainer>
        </StyledContainer>
    );
};

export default AmountWithIcon;