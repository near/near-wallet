import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';
import WhereToBuyNearModal from '../../../common/WhereToBuyNearModal';
import MethodAlreadyUsedModal from './MethodAlreadyUsedModal';
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
    const [whereToBuyModal, setWhereToBuyModal] = useState(false);
    const [methodAlreadyUsedModal, setMethodAlreadyUsedModal] = useState(false);

    return (
        <>
            <StyledContainer className='small-centered border'>
                <h1><Translate id='verifyAccount.title' /></h1>
                <h2><Translate id='verifyAccount.desc' /></h2>
                <FormButton
                    onClick={() => setWhereToBuyModal(true)}
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
                    active={activeVerificationOption}
                    translateIdTitle={optionTranslateId('email', 'title')}
                    translateIdDesc={optionTranslateId('email', 'desc')}
                />
                <VerifyWithPhoneOption
                    onClick={() => setActiveVerificationOption('phone')}
                    onChange={() => {}}
                    active={activeVerificationOption}
                    translateIdTitle={optionTranslateId('phone', 'title')}
                    translateIdDesc={optionTranslateId('phone', 'desc')}
                />
                <h4>
                    <Translate id='verifyAccount.options.initialDeposit' />
                </h4>
                <VerifyOption
                    onClick={() => setActiveVerificationOption('creditCard')}
                    option='creditCard'
                    active={activeVerificationOption}
                    translateIdTitle={optionTranslateId('creditCard', 'title')}
                    translateIdDesc={optionTranslateId('creditCard', 'desc')}
                />
                <VerifyOption
                    onClick={() => setActiveVerificationOption('manualDeposit')}
                    option='manualDeposit'
                    active={activeVerificationOption}
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
            {whereToBuyModal &&
                <WhereToBuyNearModal
                    onClose={() => setWhereToBuyModal(false)}
                    open={whereToBuyModal}
                />
            }
            {methodAlreadyUsedModal &&
                <MethodAlreadyUsedModal
                    onClose={() => setMethodAlreadyUsedModal(false)}
                    open={methodAlreadyUsedModal}
                />
            }
        </>
    );
};