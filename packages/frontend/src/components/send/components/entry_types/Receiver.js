import React from 'react';
import { Translate } from 'react-localize-redux';

import StyledContainer from './css/Style.css';

const Receiver = ({ receiverId, translateIdTitle }) => {
    /* TODO: Handle long Account ID & Add icon */
    return (
        <StyledContainer>
            <Translate id={translateIdTitle} />
            <div className='receiver'>{receiverId}</div>
        </StyledContainer>
    );
};

export default Receiver;
