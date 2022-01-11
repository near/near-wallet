import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { Textfit } from 'react-textfit';
import styled from 'styled-components';

import BackArrowButton from '../../../common/BackArrowButton';
import FormButton from '../../../common/FormButton';
import RawTokenAmount from '../RawTokenAmount';
import ReceiverInputWithLabel from '../ReceiverInputWithLabel';

const StyledContainer = styled.form`
    .token-amount {
        max-width: 85%;
        overflow: hidden;
        text-align: center;
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
    handleChangeReceiverId,
    checkAccountAvailable,
    localAlert,
    clearLocalAlert,
    onClickContinue,
    isMobile
}) => {
    const [ accountIdIsValid, setAccountIdIsValid] = useState(false);

    return (
        <StyledContainer
            className='buttons-bottom'
            onSubmit={(e) => {onClickContinue(e); e.preventDefault();}}
        >
            <div className='header'>
                <BackArrowButton onClick={onClickGoBack}/>
                <div className='token-amount'>
                    <Textfit mode='single' max={20}>
                        <RawTokenAmount
                            amount={amount}
                            symbol={selectedToken.onChainFTMetadata?.symbol}
                            decimals={selectedToken.onChainFTMetadata?.decimals}
                            showFiatAmountForNonNearToken={false}
                        />
                    </Textfit>
                </div>
            </div>
            <ReceiverInputWithLabel
                receiverId={receiverId}
                handleChangeReceiverId={handleChangeReceiverId}
                checkAccountAvailable={checkAccountAvailable}
                localAlert={localAlert}
                clearLocalAlert={clearLocalAlert}
                autoFocus={!isMobile}
                setAccountIdIsValid={setAccountIdIsValid}
            />
            <div className='input-sub-label'>
                <Translate id='input.accountId.subLabel'/>
            </div>
            <div className='buttons-bottom-buttons'>
                {/* TODO: Add error state */}
                <FormButton
                    type='submit'
                    disabled={!accountIdIsValid}
                    data-test-id="sendMoneyPageSubmitAccountIdButton"
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