import React from 'react';
import { Translate } from 'react-localize-redux';

import isDataURL from '../../../../utils/isDataURL';
import DefaultTokenIconBlack from '../../../svg/DefaultTokenIconBlack';
import StyledContainer from './css/Style.css';

const Icon = ({ symbol, icon }) => {
    if (icon && isDataURL(icon)) {
        return <img src={icon} alt={symbol}/>;
    } else {
        return <DefaultTokenIconBlack/>;
    }
};

const Token = ({ symbol, icon, translateIdTitle }) => {
    return (
        <StyledContainer>
            <Translate id={translateIdTitle} />
            <div className='icon'>
                <Icon symbol={symbol} icon={icon}/>
                {symbol}
            </div>
        </StyledContainer>
    );
};

export default Token;