import React from 'react'
import { Translate } from 'react-localize-redux'
import StyledContainer from './Style.css'
import DefaultTokenIconBlack from '../../../svg/DefaultTokenIconBlack'
import isDataURL from '../../../../utils/isDataURL'

const Icon = ({ symbol, icon }) => {
    if (icon && isDataURL(icon)) {
        return <img src={icon} alt={symbol}/>
    } else {
        return <DefaultTokenIconBlack/>
    }
}

const Token = ({ symbol, icon, translate }) => {
    return (
        <StyledContainer>
            <Translate id={translate} />
            <div className='icon'>
                <Icon symbol={symbol} icon={icon}/>
                {symbol}
            </div>
        </StyledContainer>
    )
}

export default Token