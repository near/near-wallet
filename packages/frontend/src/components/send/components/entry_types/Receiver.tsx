import React from 'react';
import { Translate } from 'react-localize-redux';

import StyledContainer from './css/Style.css';

type ReceiverProps = { receiverId: string; translateIdTitle: string };

const Receiver = ({ receiverId, translateIdTitle }: ReceiverProps) => {
    /* TODO: Handle long Account ID & Add icon */
    return (
        <StyledContainer>
            <Translate id={translateIdTitle} />
            <div className='receiver'>{receiverId}</div>
        </StyledContainer>
    );
};

export default Receiver;
