import React, { Component } from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux'
import FormButton from '../common/FormButton';

const Container = styled.div`
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .desc {
        color: #4a4f54;
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

        let recoverValue = email;

        if (!recoverWithEmail) {
            recoverValue = phoneNumber;
        }

        return (
            <Container>
                <h1><Translate id='setRecoveryConfirm.pageTitle' /></h1>
                <div className='desc one'><Translate id={`setRecoveryConfirm.pageText.one.${recoverWithEmail ? 'email' : 'phoneNumber'}`} /></div>
                <div className='desc two'><Translate id={`setRecoveryConfirm.pageText.two.${recoverWithEmail ? 'email' : 'phoneNumber'}`} /></div>
                <div className='desc recover-value'>
                    {recoverValue}
                </div>
                <FormButton
                    color='blue'
                    onClick={handleConfirmMessageReceived}
                >
                    <Translate id='button.confirm' />
                </FormButton>
                <div className='re-enter'>
                    <Translate id={`setRecoveryConfirm.reenter.one.${recoverWithEmail ? 'email' : 'phoneNumber'}`} />
                    <span onClick={handleEnterNewRecoverValue} className='link'><Translate id='setRecoveryConfirm.reenter.link' /></span>
                    <Translate id={`setRecoveryConfirm.reenter.two.${recoverWithEmail ? 'email' : 'phoneNumber'}`} />
                </div>
            </Container>
        );
    }
}

export default SetRecoveryMethodSuccess;