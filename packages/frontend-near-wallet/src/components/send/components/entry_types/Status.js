import React from 'react';
import { Translate } from 'react-localize-redux';

import TXStatus from '../TXStatus';
import StyledContainer from './css/Style.css';

const Status = ({ status, translate }) => {
    return (
        <StyledContainer>
            <Translate id={translate} />
            <TXStatus status={status}/>
        </StyledContainer>
    );
};

export default Status;
