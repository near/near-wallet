import React from 'react';
import { Translate } from 'react-localize-redux';

import TokenIcon from '../TokenIcon';
import StyledContainer from './css/Style.css';

type TokenProps = {
    symbol: string;
    icon: string;
    translateIdTitle: string;
    onClick?: () => void;
};

const Token = ({ symbol, icon, translateIdTitle, onClick }: TokenProps) => {
    /* TODO: Handle long Tokens */
    return (
        <StyledContainer className={onClick ? 'clickable' : ''} onClick={onClick}>
            {translateIdTitle && 
                <Translate id={translateIdTitle} />
            }
            <div className='icon'>
                <span><TokenIcon symbol={symbol} icon={icon}/></span>
                {symbol}
            </div>
        </StyledContainer>
    );
};

export default Token;
