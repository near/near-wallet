import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import IconCheckImage from '../../../../images/icon-check-no-border.svg';
import Checkbox from '../../../common/Checkbox';
import Image from '../../../common/image';
import { ButtonsContainer, StyledButton, MigrationModal, Container, IconBackground } from '../../CommonComponents';

const CustomImage = styled(Image)`
    width: 20px;
    height: 19px;
    margin: 0 auto;
`;

const DisclaimerContainer = styled.label`
    text-align: left;
    display: flex;
    background-color: #F5FAFF;
    margin: 25px -24px 0 -24px;
    padding: 15px 25px;
    line-height: 1.5;
`;

const DisclaimerLabel = styled.span`
    margin-left: 10px;
    word-break: break-word;
    color: #006ADC;
`;

const VerifyingModal = ({
    onClose,
    onNext,
    onStartOver,
}) => {
    const [accessToMyAccount, setAccessToMyAccount] = useState(false);

    const onCheckboxClick = (e) => setAccessToMyAccount(e.target.checked);

    return (
        <MigrationModal>
            <Container>
                <IconBackground>
                    <CustomImage src={IconCheckImage} />
                </IconBackground>
                <h3 className='title'>
                    <Translate id='walletMigration.verifying.title' />
                </h3>
                <p><Translate id='walletMigration.verifying.desc'/></p>
                <DisclaimerContainer>
                    <Checkbox
                        checked={accessToMyAccount}
                        onChange={onCheckboxClick}
                    />
                    <DisclaimerLabel>
                        <Translate id='walletMigration.verifying.disclaimer' />
                    </DisclaimerLabel>
                </DisclaimerContainer>
                <ButtonsContainer vertical>
                    <StyledButton className='gray-blue' onClick={onClose} fullWidth>
                        <Translate id='button.cancel' />
                    </StyledButton>
                    <StyledButton className='white-blue' onClick={onStartOver} fullWidth>
                        <Translate id='button.startOver' />
                    </StyledButton>
                    <StyledButton
                        onClick={onNext}
                        disabled={!accessToMyAccount}
                        fullWidth
                    >
                        <Translate id='button.continue' />
                    </StyledButton>
                </ButtonsContainer>
            </Container>
        </MigrationModal>
    );
};

export default VerifyingModal;

