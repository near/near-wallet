import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import BackArrowButton from '../BackArrowButton';
import RawTokenAmount from '../RawTokenAmount';
import ReceiverInputWithLabel from '../ReceiverInputWithLabel';

const StyledContainer = styled.form`
    .token-amount {
        > div {
            white-space: normal;
            line-break: anywhere;
            line-height: normal;
            text-align: center;
            margin: 0 auto;

            .currency {
                line-break: normal;
            }
        }
    }

    .input-sub-label {
        color: #A2A2A8;
    }
`;

const EnterReceiver = ({ 
    onClickGoBack,
    onClickCancel,
    amount,
    selectedToken,
    receiverId,
    handleChangeReciverId,
    checkAccountAvailable,
    localAlert,
    clearLocalAlert,
    onClickContinue
}) => {

    const inputError = !localAlert?.success && localAlert?.show;
    const continueAllowed = localAlert?.success && localAlert?.show;

    return (
        <StyledContainer 
            className='buttons-bottom enter-amount'
            onSubmit={(e) => {onClickContinue(e); e.preventDefault();}}
        >
            <div className='header'>
                <BackArrowButton onClick={onClickGoBack}/>
                <div className='token-amount'>
                    <RawTokenAmount
                        amount={amount}
                        symbol={selectedToken.symbol}
                        decimals={selectedToken.decimals}
                    />
                </div>
            </div>
            <ReceiverInputWithLabel
                receiverId={receiverId}
                handleChangeReciverId={handleChangeReciverId}
                checkAccountAvailable={checkAccountAvailable}
                localAlert={localAlert}
                clearLocalAlert={clearLocalAlert}
                inputError={inputError}
            />
            <div className='input-sub-label'>
                <Translate id='input.accountId.subLabel'/>
            </div>
            <div className='buttons-bottom-buttons'>
                {/* TODO: Add error state */}
                <FormButton
                    color='dark-gray'
                    type='submit'
                    disabled={!continueAllowed}
                >
                    <Translate id='button.continue'/>
                </FormButton>
                <FormButton
                    type='button'
                    onClick={onClickCancel}
                    className='link'
                    color='gray'
                >
                    <Translate id='button.cancel'/>
                </FormButton>
            </div>
        </StyledContainer>
    );
};

export default EnterReceiver;