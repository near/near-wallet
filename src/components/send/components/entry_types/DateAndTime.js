import React from 'react';
import { Translate } from 'react-localize-redux';

import formatTimestampForLocale from '../../../../utils/formatTimestampForLocale';
import StyledContainer from './css/Style.css';

const DateAndTime = ({ timeStamp, translateIdTitle }) => {
    return (
        <StyledContainer>
            <Translate id={translateIdTitle} />
            <div className='time'>{formatTimestampForLocale(timeStamp)}</div>
        </StyledContainer>
    );
};

export default DateAndTime;