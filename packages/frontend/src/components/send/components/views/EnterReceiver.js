import React, { useState } from 'react';
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
    const [isImplicitAccount, setIsImplicitAccount] = useState(false);
    const hasAccountValidationError = localAlert && localAlert.show && !localAlert.success;
    const validAccountId = hasAccountValidationError ? null : receiverId;

    // localAlert comes as {} object when no result is available
    // or as { show: false, success: false, message: 'ACTION_TYPE.pending' }
    let isEmptyAlert = !localAlert || localAlert.show === undefined || localAlert.show === false;
    isEmptyAlert = isImplicitAccount ? false : isEmptyAlert;

    const { isRSWarned, isRSIgnored, setIsRSIgnored, isRSFinished } = useRiskScoringCheck(validAccountId);
    const hasRiskScoreValidationError = isRSWarned && !isRSIgnored;
    const isBlockedByRiskScoring = hasRiskScoreValidationError || !isRSFinished;

    const isLoading = !isRSFinished || isEmptyAlert;
    const isSuccess = !isLoading && localAlert?.success && !isBlockedByRiskScoring;
    const isProblem = !isLoading && hasAccountValidationError || hasRiskScoreValidationError;

    return (
        <StyledContainer
            className='buttons-bottom'
            onSubmit={(e) => {
                onClickContinue(e);
                e.preventDefault();
            }}
        >
            <div className='header'>
                <BackArrowButton onClick={onClickGoBack} />
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
                setIsImplicitAccount={setIsImplicitAccount}
                localAlert={localAlert}
                clearLocalAlert={clearLocalAlert}
                autoFocus={!isMobile}
                isSuccess={isSuccess}
                isProblem={isProblem}
            />
            {isRSWarned && <RiscScoringForm isIgnored={isRSIgnored} setIsRSIgnored={setIsRSIgnored} />}
            <div className='input-sub-label'>
                <Translate id='input.accountId.subLabel' />
            </div>
            <div className='buttons-bottom-buttons'>
                {/* TODO: Add error state */}
                <FormButton
                    type='submit'
                    disabled={isLoading || isProblem}
                    data-test-id="sendMoneyPageSubmitAccountIdButton"
                >
                    <Translate id='button.continue' />
                </FormButton>
                <FormButton
                    type='button'
                    onClick={onClickCancel}
                    className='link'
                    color='gray'
                >
                    <Translate id='button.cancel' />
                </FormButton>
            </div>
        </StyledContainer>
    );
};

export default EnterReceiver;
