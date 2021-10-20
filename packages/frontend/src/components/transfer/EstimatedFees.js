import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Balance from '../common/balance/Balance';
import Tooltip from '../common/Tooltip';

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
        display: flex;
        align-items: center;
    }

    .balance {
        text-align: right;
        .near-amount {
            color: #3F4045;
        }
        .fiat-amount {
            color: #A2A2A8;
            margin-top: 3px;
        }
    }
`;

export default ({ gasFeeAmount }) => {
    return (
        <StyledContainer className='estimated-fees pg-20 brs-8 br-1-grey'>
            <div className='left'>
                <Translate id='transfer.estimatedFees' />
                <Tooltip translate='sendV2.translateIdInfoTooltip.estimatedFees' />
            </div>
            <Balance
                amount={gasFeeAmount}
                showSymbolUSD={false}
            />
        </StyledContainer>
    );
};