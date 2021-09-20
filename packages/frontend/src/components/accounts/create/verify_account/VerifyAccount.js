import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { isValidPhoneNumber } from 'react-phone-number-input';
import styled from 'styled-components';

import { validateEmail } from '../../../../utils/account';
import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';
import WhereToBuyNearModal from '../../../common/WhereToBuyNearModal';
import OptionAlreadyUsedModal from './OptionAlreadyUsedModal';
import VerifyOption from './VerifyOption';
// import VerifyWithEmailOption from './VerifyWithEmailOption';
import VerifyWithPhoneOption from './VerifyWithPhoneOption';

const StyledContainer = styled(Container)`
    &&& {
        h4 {
            margin-top: 40px;
            font-weight: 600;
            font-size: 15px;
            display: flex;
            align-items: center;
        }

        [type='submit'] {
            width: 100%;
            margin-top: 50px;
        }
    }
`;

const optionTranslateId = (option, type) => `verifyAccount.option.${option}.${type}`;

export default ({
    handleContinue,
    activeVerificationOption,
    setActiveVerificationOption,
    verificationEmail,
    // onChangeVerificationEmail,
    verificationNumber,
    onChangeVerificationNumber,
    showOptionAlreadyUsedModal,
    onCloseOptionAlreadyUsedModal,
    showFundWithCreditCardOption
}) => {
    const [showWhereToBuyModal, setShowWhereToBuyModal] = useState(false);

    const isValidOptionInput = () => {
        switch (activeVerificationOption) {
            case 'email':
                return validateEmail(verificationEmail);
            case 'phone':
                return isValidPhoneNumber(verificationNumber);
            case 'creditCard':
                return true;
            case 'manualDeposit':
                return true;
            default:
                return false;
        }
    };

    return (
        <>
            <StyledContainer className='small-centered border'>
                <form onSubmit={e => {
                    handleContinue();
                    e.preventDefault();
                }}>
                    <h1><Translate id='verifyAccount.title' /></h1>
                    <h2><Translate id='verifyAccount.desc' /></h2>
                    <FormButton
                        onClick={() => setShowWhereToBuyModal(true)}
                        type='button'
                        color='blue'
                        className='link underline'
                        trackingId="CA Click where to buy button"
                    >
                        <Translate id='account.createImplicit.pre.whereToBuy.button' />
                    </FormButton>
                    <h4>
                        <Translate id='verifyAccount.options.passCode' />
                    </h4>
                    {/*<VerifyWithEmailOption*/}
                    {/*    onClick={() => setActiveVerificationOption('email')}*/}
                    {/*    onChangeVerificationEmail={onChangeVerificationEmail}*/}
                    {/*    verificationEmail={verificationEmail}*/}
                    {/*    activeVerificationOption={activeVerificationOption}*/}
                    {/*    translateIdTitle={optionTranslateId('email', 'title')}*/}
                    {/*    translateIdDesc={optionTranslateId('email', 'desc')}*/}
                    {/*/>*/}
                    <VerifyWithPhoneOption
                        onClick={() => setActiveVerificationOption('phone')}
                        onChangeVerificationNumber={onChangeVerificationNumber}
                        verificationNumber={verificationNumber}
                        activeVerificationOption={activeVerificationOption}
                        translateIdTitle={optionTranslateId('phone', 'title')}
                        translateIdDesc={optionTranslateId('phone', 'desc')}
                    />
                    <h4>
                        <Translate id='verifyAccount.options.initialDeposit' />
                    </h4>
                    {showFundWithCreditCardOption &&
                        <VerifyOption
                            onClick={() => setActiveVerificationOption('creditCard')}
                            option='creditCard'
                            isActive={activeVerificationOption === 'creditCard'}
                            translateIdTitle={optionTranslateId('creditCard', 'title')}
                            translateIdDesc={optionTranslateId('creditCard', 'desc')}
                        />
                    }
                    <VerifyOption
                        onClick={() => setActiveVerificationOption('manualDeposit')}
                        option='manualDeposit'
                        isActive={activeVerificationOption === 'manualDeposit'}
                        translateIdTitle={optionTranslateId('manualDeposit', 'title')}
                        translateIdDesc={optionTranslateId('manualDeposit', 'desc')}
                    />
                    <FormButton
                        disabled={!isValidOptionInput() || showOptionAlreadyUsedModal}
                        type='submit'
                        className='continue'
                    >
                        <Translate id='button.continue' />
                    </FormButton>
                </form>
                <div className='recaptcha-disclaimer'><Translate id='reCAPTCHA.disclaimer'/></div>
            </StyledContainer>
            {showWhereToBuyModal &&
                <WhereToBuyNearModal
                    onClose={() => setShowWhereToBuyModal(false)}
                    open={showWhereToBuyModal}
                />
            }
            {showOptionAlreadyUsedModal &&
                <OptionAlreadyUsedModal
                    onClose={onCloseOptionAlreadyUsedModal}
                    isOpen={showOptionAlreadyUsedModal}
                    kind={activeVerificationOption}
                />
            }
        </>
    );
};