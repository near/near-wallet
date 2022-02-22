import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { IS_MAINNET } from '../../config';
import HardwareDeviceIcon from '../../images/icon-hardware-device.svg';
import EmailIcon from '../../images/icon-recover-email.svg';
import PhoneIcon from '../../images/icon-recover-phone.svg';
import PhraseIcon from '../../images/icon-recover-seedphrase.svg';
import { Mixpanel } from '../../mixpanel/index';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import SmartPhoneIcon from '../svg/SmartPhoneIcon';


const StyledContainer = styled(Container)`
    h1, h2 {
        text-align: center;
    }
    h2 {
        margin-top: 20px;
    }
    @media (min-width: 992px) {
        h1, h2 {
            max-width: 700px;
            margin: 0 auto;
        }
        h2 {
            margin-top: 20px;
        }
    }
`;

const Options = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    padding-bottom: 40px;
    @media (min-width: 992px) {
        flex-direction: row;
        flex-wrap: wrap;
    }
`;

const Option = styled.div`
    flex: 1;
    border: 3px solid #f5f5f5;
    border-radius: 6px;
    padding: 25px;
    margin-bottom: 25px;
    min-width: 30%;
    @media (min-width: 992px) {
        margin: 20px;
    }
    @media (min-width: 992px) {
        max-width: 420px;
    }
    @media (min-width: 1200px) {
        max-width: 460px;
    }
    > button {
        width: 100%;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    color: #24272a;
    font-weight: 500;
    font-size: 16px;
    :not(.no-background) {
        :before {
            content: '';
            background: url(${(props) => props.icon});
            background-repeat: no-repeat;
            display: block;
            width: 40px;
            height: 40px;
            margin-right: 15px;
            margin-top: -5px;
        }
    }
    .smart-phone-icon {
        width: 40px;
        height: 40px;
        margin-left: -5px;
        margin-right: 10px;
        path {
            stroke: #8dd4bd;
            stroke-width: 1.5;
        }
    }
`;

const P = styled.p`
    color: #4a4f54;
    &:first-of-type {
        margin-top: 20px;
    }
    span {
        font-weight: 500;
    }
`;

const RecoverAccount = ({
    locationSearch,
    isMobile
}) => {
    return (
        <StyledContainer>
            <h1><Translate id='recoverAccount.pageTitle'/></h1>
            <h2><Translate id='recoverAccount.pageText'/></h2>
            <Options>
                <Option>
                    <Header icon={EmailIcon}><Translate id='recoverAccount.email.title'/></Header>
                    <P><Translate id='recoverAccount.email.desc'/> <span><Translate id='recoverAccount.email.subject'/></span></P>
                    <P><Translate id='recoverAccount.actionRequired'/></P>
                    <P><Translate id='recoverAccount.cannotResend'/></P>
                </Option>
                <Option>
                    <Header icon={PhoneIcon}><Translate id='recoverAccount.phone.title'/></Header>
                    <P><Translate id='recoverAccount.phone.desc'/> <span><Translate id='recoverAccount.phone.number'/></span></P>
                    <P><Translate id='recoverAccount.actionRequired'/></P>
                    <P><Translate id='recoverAccount.cannotResend'/></P>
                </Option>
                <Option>
                    <Header icon={PhraseIcon}><Translate id='recoverAccount.phrase.title'/></Header>
                    <P><Translate id='recoverAccount.phrase.desc'/></P>
                    <FormButton
                        color='seafoam-blue'
                        linkTo={`/recover-seed-phrase${locationSearch}`}
                        onClick={()=> Mixpanel.track('IE Click seed phrase recovery button')}
                        data-test-id="recoverAccountWithPassphraseButton"
                    >
                            <Translate id='button.recoverAccount' />
                    </FormButton>
                </Option>
                <Option>
                    <Header icon={HardwareDeviceIcon}><Translate id='recoverAccount.ledger.title'/></Header>
                    <P><Translate id='recoverAccount.ledger.desc'/></P>
                    <FormButton
                        color='seafoam-blue'
                        linkTo={`/sign-in-ledger${locationSearch}`}
                        onClick={()=> Mixpanel.track('IE Click ledger recovery button')}
                    >
                            <Translate id='button.signInLedger' />
                    </FormButton>
                </Option>
                {!IS_MAINNET && isMobile &&
                    <Option>
                        <Header className='no-background'><SmartPhoneIcon/><Translate id='mobileDeviceAccess.title'/></Header>
                        <P><Translate id='mobileDeviceAccess.importCode.desc'/></P>
                    </Option>
                }
            </Options>
        </StyledContainer>
    );
};

export default RecoverAccount;
