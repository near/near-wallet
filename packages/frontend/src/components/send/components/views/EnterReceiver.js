import React from 'react';
import { Translate } from 'react-localize-redux';
import { Textfit } from 'react-textfit';
import styled from 'styled-components';

import BackArrowButton from '../../../common/BackArrowButton';
import FormButton from '../../../common/FormButton';
import RawTokenAmount from '../RawTokenAmount';
import ReceiverInputWithLabel from '../ReceiverInputWithLabel';
import RiscScoringForm, { useRiskScoringCheck } from '../RiscScoringForm';

const StyledContainer = styled.form`
    .token-amount {
        max-width: 85%;
        overflow: hidden;
        text-align: center;
    }

    .input-sub-label {
        color: #A2A2A8;
    }

    .risk-scoring-warning + .input-sub-label {
        display: none;
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
    const validAccount = (localAlert?.success && localAlert?.show) ? receiverId : null;
    const { isRSWarned, isRSIgnored, setIsRSIgnored } = useRiskScoringCheck(validAccount);
    const isSuccess = localAlert?.success && (!isRSWarned || isRSIgnored);
    const isProblem = (!localAlert?.success && localAlert?.show) || (isRSWarned && !isRSIgnored);

    return (
        <StyledContainer
            className='buttons-bottom'
            onSubmit={(e) => {
                onClickContinue(e);
                e.preventDefault();
            }}
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
                isSuccess={isSuccess}
                isProblem={isProblem}
            />
            {isRSWarned && <RiscScoringForm setIsRSIgnored={setIsRSIgnored} />}
            <div className='input-sub-label'>
                <Translate id='input.accountId.subLabel'/>
            </div>
            <div className='buttons-bottom-buttons'>
                {/* TODO: Add error state */}
                <FormButton
                    type='submit'
                    disabled={validAccount === null || !isRSIgnored}
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
