import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';

// Images
import EmailIcon from '../../images/icon-recover-email.svg';
import PhoneIcon from '../../images/icon-recover-phone.svg';
import PhraseIcon from '../../images/icon-recover-seedphrase.svg';
import HardwareDeviceIcon from '../../images/icon-hardware-device.svg';
import Container from '../common/styled/Container.css'

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
    padding: 15px;
    margin-bottom: 25px;
    min-height: 236px;
    min-width: 30%;

    @media (min-width: 992px) {
        margin: 20px;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    color: #24272a;
    font-weight: 500;
    font-size: 16px;

    &:before {
        content: '';
        background: url(${props => props.icon});
        background-repeat: no-repeat;
        display: block;
        width: 40px;
        height: 40px;
        margin-right: 15px;
        margin-top: -5px;
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

const Button = styled(Link)`
    background-color: #6AD1E3;
    font-weight: 500;
    display: inline-block;
    border: 0;
    border-radius: 40px;
    color: white;
    outline: none;
    cursor: pointer;
    height: 48px;
    width: 100%;
    letter-spacing: 0.5px;
    margin-top: 20px;
    transition: 100ms;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;

    &:hover {
        background-color: #72dff2;
        color: white;
        text-decoration: none;
    }

    &::selection {
        color: white;
    }
`;

const RecoverAccount = () => {
    return (
        <StyledContainer>
            <h1><Translate id='recoverAccount.pageTitle'/></h1>
            <h2><Translate id='recoverAccount.pageText'/></h2>
            <Options>
                <Option>
                    <Header icon={EmailIcon}><Translate id='recoverAccount.email.title'/><br/><Translate id='recoverAccount.actionType'/></Header>
                    <P><Translate id='recoverAccount.email.desc'/> <span><Translate id='recoverAccount.email.subject'/></span></P>
                    <P><Translate id='recoverAccount.actionRequired'/></P>
                    <P><Translate id='recoverAccount.cannotResend'/></P>
                </Option>
                <Option>
                    <Header icon={PhoneIcon}><Translate id='recoverAccount.phone.title'/><br/><Translate id='recoverAccount.actionType'/></Header>
                    <P><Translate id='recoverAccount.phone.desc'/> <span><Translate id='recoverAccount.phone.number'/></span></P>
                    <P><Translate id='recoverAccount.actionRequired'/></P>
                    <P><Translate id='recoverAccount.cannotResend'/></P>
                </Option>
                <Option>
                    <Header icon={PhraseIcon}><Translate id='recoverAccount.phrase.title'/><br/><Translate id='recoverAccount.actionType'/></Header>
                    <P><Translate id='recoverAccount.phrase.desc'/></P>
                    <Button to='/recover-seed-phrase'><Translate id='button.recoverAccount' /></Button>
                </Option>
                <Option>
                    <Header icon={HardwareDeviceIcon}><Translate id='recoverAccount.ledger.title'/><br/><Translate id='recoverAccount.actionType'/></Header>
                    <P><Translate id='recoverAccount.ledger.desc'/></P>
                    <Button to='/sign-in-ledger'><Translate id='button.signInLedger' /></Button>
                </Option>
            </Options>
        </StyledContainer>
    )
}

export const RecoverAccountWithRouter = withRouter(RecoverAccount);
