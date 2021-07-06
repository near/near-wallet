import React from 'react';
import { Translate } from 'react-localize-redux';

import Balance from '../../../common/Balance';
import TokenAmount from '../../../wallet/TokenAmount';
import StyledContainer from './Style.css';

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

const Amount = ({ symbol, amount, decimals, translate, withInfo }) => {
    /* TODO: Handle long amounts */
    /* TODO: Add 'withInfo' tooltip */
    return (
        <StyledContainer>
            <Translate id={translate} />
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