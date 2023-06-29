import React from 'react';
import { Translate } from 'react-localize-redux';

import StyledContainer from './css/Style.css';
import formatTimestampForLocale from '../../../../utils/formatTimestampForLocale';

const DateAndTime = ({ timeStamp, translateIdTitle }) => {
    return (
        <StyledContainer>
            <Translate id={translateIdTitle} />
            <div className='time'>{formatTimestampForLocale(timeStamp)}</div>
        </StyledContainer>
    );
};

export default DateAndTime;
