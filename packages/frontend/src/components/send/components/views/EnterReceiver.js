import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { Textfit } from 'react-textfit';
import styled from 'styled-components';

import { HAPI_RISK_SCORING } from '../../../../../../../features';
import HapiService from '../../../../services/HapiService';
import BackArrowButton from '../../../common/BackArrowButton';
import FormButton from '../../../common/FormButton';
import HapiForm from '../HapiForm';
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
    const [ accountId, setAccountId] = useState(false);
    const [ accountIdIsValid, setAccountIdIsValid] = useState(false);
    const [ isHAPIWarn, setIsHAPIWarn] = useState(false);
    const [ isHAPIConsentEnabled, setIsHAPIConsentEnabled] = useState(false);
    const success = localAlert?.success && (!isHAPIWarn || isHAPIConsentEnabled);
    const problem = (!localAlert?.success && localAlert?.show) || (isHAPIWarn && !isHAPIConsentEnabled);


    useEffect(() => {
        async function checkAccountWithHapi() {
            try {
                const hapiStatus =  await HapiService.checkAddress({accountId});
                if (hapiStatus && hapiStatus[0] !== 'None') {
                    setAccountIdIsValid(false);
                    setIsHAPIWarn(true);
                }
            } catch (e) {
                // continue work
            }
        }

        if (accountIdIsValid && HAPI_RISK_SCORING) {
            checkAccountWithHapi();
        } else {
            setIsHAPIWarn(false);
        }
    }, [accountId, accountIdIsValid]);

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
                setAccountId={setAccountId}
                setAccountIdIsValid={setAccountIdIsValid}
                success={success}
                problem={problem}
            />
            {isHAPIWarn
                ? (
                    <HapiForm
                        setIsHAPIConsentEnabled={setIsHAPIConsentEnabled}
                    />
                ) : (
                    <div className='input-sub-label'>
                        <Translate id='input.accountId.subLabel'/>
                    </div>
                )
            }
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
