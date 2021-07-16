import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import isMobile from '../../../utils/isMobile';
import AccountIdInput from './AccountIdInput';

const StyledContainer = styled.div`
    background-color: #FAFAFA;
    border: 2px solid #FAFAFA;
    display: flex;
    border-radius: 8px;
    transition: 100ms;
    color: #272729;
    font-weight: 600;
    white-space: nowrap;
    align-items: center;
    padding-left: 15px;
    margin-top: 50px;

    &.focus {
        background-color: white;
        border-color: #E5E5E6;
    }
`;

const isMobileDevice = isMobile();

const ReceiverInputWithLabel = ({
    receiverId,
    handleChangeReciverId,
    checkAccountAvailable,
    localAlert,
    clearLocalAlert,
    inputError
}) => {

    const [inputHasFocus, setInputHasFocus] = useState(null);

    // TODO: Add error style

    return (
        <StyledContainer className={inputHasFocus ? 'focus' : ''}>
            <Translate id='sendV2.selectReceiver.receiverInputLabel' />
            <AccountIdInput
                accountId={receiverId}
                handleChange={handleChangeReciverId}
                ReceiverInputWithLabel={ReceiverInputWithLabel}
                checkAvailability={checkAccountAvailable}
                localAlert={localAlert}
                clearLocalAlert={clearLocalAlert}
                onFocus={() => setInputHasFocus(true)}
                onBlur={() => setInputHasFocus(false)}
                autoFocus={!receiverId && !isMobileDevice}
            />  
        </StyledContainer>
    );
};

export default ReceiverInputWithLabel;