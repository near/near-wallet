import React, { Component } from 'react';
import styled from 'styled-components';
import FormButton from '../common/FormButton';

const Container = styled.div`
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .desc {
        color: #4a4f54;
        font-family: BwSeidoRound !important;
        line-height: 130%;
        font-size: 20px;
        
        &.one {
            margin-top: -10px;
        }

        &.two {
            margin-top: 10px;
        }

        @media (max-width: 767px) {
            font-size: 18px;
        }
    }

    .recover-value {
        background-color: #f8f8f8;
        padding: 3px 10px;
        color: #24272a;
    }

    .re-enter {
        border-top: 2px solid #f8f8f8;
        margin-top: 30px;

        @media (max-width: 767px) {
            padding-top: 10px;
            line-height: 100%;
        }
    }
`;

class SetRecoveryMethodSuccess extends Component {

    render() {
        const {
            recoverWithEmail,
            phoneNumber,
            email,
            handleConfirmMessageReceived,
            handleEnterNewRecoverValue
        } = this.props;

        let recoveryType = 'email';
        let recoverValue = email;

        if (!recoverWithEmail) {
            recoveryType = 'SMS';
            recoverValue = phoneNumber;
        }

        return (
            <Container>
                <h1>Confirm Recovery Setup</h1>
                <div className='desc one'>You should have received an {recoveryType} with a magic link. If you ever lose access to your account, simply click the link, and your account will be restored.</div>
                <div className='desc two'>Please confirm receipt of this {recoveryType} at:</div>
                <div className='desc recover-value'>
                    {recoverValue}
                </div>
                <FormButton
                    color='blue'
                    onClick={handleConfirmMessageReceived}
                >
                    CONFIRM
                </FormButton>
                <div className='re-enter'>
                    If you did not yet receive this {recoveryType}, or the above {recoverWithEmail ? 'email address' : 'phone number'} is incorrect, <span onClick={handleEnterNewRecoverValue} className='link'>click here</span> to Re-enter your {recoverWithEmail ? 'email address' : 'phone number'} and resend.
                </div>
            </Container>
        );
    }
}

export default SetRecoveryMethodSuccess;