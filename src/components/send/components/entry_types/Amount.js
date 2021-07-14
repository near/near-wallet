import React from 'react';
import { Translate } from 'react-localize-redux';

import Balance from '../../../common/Balance';
import Tooltip from '../../../common/Tooltip';
import TokenAmount from '../../../wallet/TokenAmount';
import StyledContainer from './css/Style.css';

const RawAmount = ({ symbol, amount, decimals }) => {
    if (decimals && symbol) {
        return (
            <TokenAmount 
                token={{ symbol, decimals, balance: amount }}
                withSymbol={true}
            />
        );
    } else {
        return <Balance amount={amount} symbol='near'/>;
    }
};

const Amount = ({ className, symbol, amount, decimals, translateIdTitle, translateIdInfoTooltip }) => {
    /* TODO: Handle long amounts */
    return (
        <StyledContainer className={className}>
            <Translate id={translateIdTitle} />
            {translateIdInfoTooltip &&
                <Tooltip translate={translateIdInfoTooltip}/>
            }
            <div className='amount'>
                <RawAmount
                    symbol={symbol}
                    amount={amount}
                    decimals={decimals}
                />
            </div>
        </StyledContainer>
    );
};

export default Amount;