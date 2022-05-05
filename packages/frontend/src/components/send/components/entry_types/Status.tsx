import React from 'react';
import { Translate } from 'react-localize-redux';

import TXStatus from '../TXStatus';
import StyledContainer from './css/Style.css';

type StatusProps = { status: string; translate: string };

const Status = ({ status, translate }: StatusProps) => {
    return (
        <StyledContainer>
            <Translate id={translate} />
            <TXStatus status={status}/>
        </StyledContainer>
    );
};

export default Status;
