import React from 'react';
import { Translate } from 'react-localize-redux';

import TokenIcon from '../TokenIcon';
import StyledContainer from './css/Style.css';

const Token = ({ symbol, icon, translateIdTitle }) => {
    /* TODO: Handle long Tokens */
    return (
        <StyledContainer>
            {translateIdTitle && 
                <Translate id={translateIdTitle} />
            }
            <div className='icon'>
                <TokenIcon symbol={symbol} icon={icon}/>
                {symbol}
            </div>
        </StyledContainer>
    );
};

export default Token;