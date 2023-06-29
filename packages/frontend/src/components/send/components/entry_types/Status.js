import React from 'react';
import { Translate } from 'react-localize-redux';

import StyledContainer from './css/Style.css';
import TXStatus from '../TXStatus';

const Status = ({ status, translate }) => {
    return (
        <StyledContainer>
            <Translate id={translate} />
            <TXStatus status={status}/>
        </StyledContainer>
    );
};

export default Status;
