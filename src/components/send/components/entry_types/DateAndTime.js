import React from 'react'
import { Translate } from 'react-localize-redux'
import StyledContainer from './Style.css'
import getDateAndTime from '../../../../utils/getDateAndTime'

const DateAndTime = ({ timeStamp, translate }) => {
    return (
        <StyledContainer>
            <Translate id={translate} />
            <div className='time'>{getDateAndTime(timeStamp)}</div>
        </StyledContainer>
    )
}

export default DateAndTime