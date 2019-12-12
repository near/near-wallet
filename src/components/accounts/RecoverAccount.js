import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';

// Images
import EmailIcon from '../../images/icon-recover-email.svg';
import PhoneIcon from '../../images/icon-recover-phone.svg';
import PhraseIcon from '../../images/icon-recover-seedphrase.svg';

const Container = styled.div`
    h2 {
      color: #4a4f54 !important;
      margin-top: -20px;
      max-width: 600px;
      font-size: 20px !important;

        @media (max-width: 767px) {
            margin-top: -10px;
            font-size: 16px !important;
        }
    }
`;

const Options = styled.div`
    display: flex;
    margin-top: 35px;

    @media (max-width: 767px) {
        flex-direction: column;
        margin-top: 10px;
        padding-bottom: 40px;
    }
`;

const Option = styled.div`
    flex: 1;
    padding: 5px 40px 0 40px;
    border-right: 3px solid #f5f5f5;

    &:first-of-type {
        padding-left: 0;
    }

    &:last-of-type {
        border: 0;
    }

    @media (max-width: 767px) {
        border: 0;
        padding: 20px 0;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    color: #24272a;
    font-weight: 600;
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
        font-weight: 600;
    }
`;

const Button = styled(Link)`
    background-color: #6AD1E3;
    font-weight: 600;
    display: inline-block;
    border: 0;
    border-radius: 40px;
    color: white;
    outline: none;
    cursor: pointer;
    height: 40px;
    width: 220px;
    letter-spacing: 0.5px;
    margin-top: 20px;
    transition: 100ms;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: #72dff2;
        color: white;
        text-decoration: none;
    }

    &::selection {
        color: white;
    }

    @media (max-width: 767px) {
        height: 48px;
        width: 100%;
    }
`;

const RecoverAccount = () => {
    return (
        <Container className='ui container'>
            <h1>Recover Your Account</h1>
            <h2>If you’ve setup one or more account recovery methods, follow the instructions below to begin the recovery process.</h2>
            <Options>
                <Option>
                    <Header icon={EmailIcon}>Email<br/>Recovery</Header>
                    <P>Check your email for a message from nearprotocol.com with the subject: <span>“Important: Near Wallet Recovery Email”.</span></P>
                    <P>This message contains a magic link. Click the link to begin recovery!</P>
                </Option>
                <Option>
                    <Header icon={PhoneIcon}>Phone<br/>Recovery</Header>
                    <P>Check your phone records for an SMS message from <span>+14086179592</span>.</P>
                    <P>This message contains a magic link. Click the link to begin recovery!</P>
                </Option>
                <Option>
                    <Header icon={PhraseIcon}>Seed Phrase<br/>Recovery</Header>
                    <P>Make sure you have your 12 word recovery phrase, then click below to begin the recovery process.</P>
                    <Button to='/recover-seed-phrase'>RECOVER ACCOUNT</Button>
                </Option>
            </Options>
        </Container>
    )
}

export const RecoverAccountWithRouter = withRouter(RecoverAccount);
