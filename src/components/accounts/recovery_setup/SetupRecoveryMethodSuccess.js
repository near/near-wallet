import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux'
import FormButton from '../../common/FormButton';

const Container = styled.div`
    display: flex !important;
    flex-direction: column;
    align-items: flex-start;

    .desc {
        color: #4a4f54;
        font-family: BwSeidoRound !important;
        line-height: 130%;
        font-size: 20px;
        max-width: 800px;
        
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
`

const SetRecoveryMethodSuccess = ({
    option,
    phoneNumber,
    email,
    onConfirm,
    onGoBack
}) => {

    let useEmail = true;
    if (option !== 'email') {
        useEmail = false;
    }

    return (
        <Container className='ui container'>
            <h1><Translate id='setRecoveryConfirm.pageTitle' /></h1>
            <div className='desc one'><Translate id={`setRecoveryConfirm.pageText.one.${useEmail ? 'email' : 'phoneNumber'}`} /></div>
            <div className='desc two'><Translate id={`setRecoveryConfirm.pageText.two.${useEmail ? 'email' : 'phoneNumber'}`} /></div>
            <div className='desc recover-value'>
                {useEmail ? email : phoneNumber}
            </div>
            <FormButton
                color='blue'
                onClick={onConfirm}
            >
                <Translate id='button.confirm' />
            </FormButton>
            <div className='re-enter'>
                <Translate id={`setRecoveryConfirm.reenter.one.${useEmail ? 'email' : 'phoneNumber'}`} />
                <span onClick={onGoBack} className='link'><Translate id='setRecoveryConfirm.reenter.link'/></span>
                <Translate id={`setRecoveryConfirm.reenter.two.${useEmail ? 'email' : 'phoneNumber'}`} />
            </div>
        </Container>
    )
}

SetRecoveryMethodSuccess.propTypes = {
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    option: PropTypes.string.isRequired,
    onGoBack: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
}

export default SetRecoveryMethodSuccess;