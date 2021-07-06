import React from 'react';
import { Translate } from 'react-localize-redux';

import formatTimestampForLocale from '../../../../utils/formatTimestampForLocale';
import StyledContainer from './Style.css';

const DateAndTime = ({ timeStamp, translate }) => {
    return (
        <StyledContainer>
            <Translate id={translate} />
            <div className='time'>{formatTimestampForLocale(timeStamp)}</div>
        </StyledContainer>
    );
};

export default DateAndTime;