import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';
import WhereToBuyNearModal from '../../../common/WhereToBuyNearModal';
import OptionAlreadyUsedModal from './OptionAlreadyUsedModal';
import VerifyOption from './VerifyOption';
import VerifyWithEmailOption from './VerifyWithEmailOption';
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

        > button {
            &.continue {
                width: 100%;
                margin-top: 50px;
            }
        }
    }
`;

const optionTranslateId = (option, type) => `verifyAccount.option.${option}.${type}`;

export default ({
    handleContinue
}) => {
    const [activeVerificationOption, setActiveVerificationOption] = useState('email');
    const [showWhereToBuyModal, setShowWhereToBuyModal] = useState(false);
    const [showOptionAlreadyUsedModal, setShowOptionAlreadyUsedModal] = useState(false);

    return (
        <>
            <StyledContainer className='small-centered border'>
                <h1><Translate id='verifyAccount.title' /></h1>
                <h2><Translate id='verifyAccount.desc' /></h2>
                <FormButton
                    onClick={() => setShowWhereToBuyModal(true)}
                    color='blue'
                    className='link underline'
                    trackingId="CA Click where to buy button"
                >
                    <Translate id='account.createImplicit.pre.whereToBuy.button' />
                </FormButton>
                <h4>
                    <Translate id='verifyAccount.options.passCode' />
                </h4>
                <VerifyWithEmailOption
                    onClick={() => setActiveVerificationOption('email')}
                    activeVerificationOption={activeVerificationOption}
                    translateIdTitle={optionTranslateId('email', 'title')}
                    translateIdDesc={optionTranslateId('email', 'desc')}
                />
                <VerifyWithPhoneOption
                    onClick={() => setActiveVerificationOption('phone')}
                    onChange={() => {}}
                    activeVerificationOption={activeVerificationOption}
                    translateIdTitle={optionTranslateId('phone', 'title')}
                    translateIdDesc={optionTranslateId('phone', 'desc')}
                />
                <h4>
                    <Translate id='verifyAccount.options.initialDeposit' />
                </h4>
                <VerifyOption
                    onClick={() => setActiveVerificationOption('creditCard')}
                    option='creditCard'
                    isActive={activeVerificationOption === 'creditCard'}
                    translateIdTitle={optionTranslateId('creditCard', 'title')}
                    translateIdDesc={optionTranslateId('creditCard', 'desc')}
                />
                <VerifyOption
                    onClick={() => setActiveVerificationOption('manualDeposit')}
                    option='manualDeposit'
                    isActive={activeVerificationOption === 'manualDeposit'}
                    translateIdTitle={optionTranslateId('manualDeposit', 'title')}
                    translateIdDesc={optionTranslateId('manualDeposit', 'desc')}
                />
                <FormButton
                    onClick={handleContinue}
                    className='continue'
                >
                    <Translate id='button.continue' />
                </FormButton>
            </StyledContainer>
            {showWhereToBuyModal &&
                <WhereToBuyNearModal
                    onClose={() => setShowWhereToBuyModal(false)}
                    open={showWhereToBuyModal}
                />
            }
            {showOptionAlreadyUsedModal &&
                <OptionAlreadyUsedModal
                    onClose={() => setShowOptionAlreadyUsedModal(false)}
                    isOpen={showOptionAlreadyUsedModal}
                />
            }
        </>
    );
};