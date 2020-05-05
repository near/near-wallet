import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux'
import FormButton from '../../common/FormButton';

const Container = styled.form`
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

    input {
        width: 100%;
        margin-top: 20px !important;

        @media (min-width: 768px) {
            max-width: 288px;
        }
    }
`

const SetRecoveryMethodSuccess = ({
    option,
    onConfirm,
    onGoBack,
    email,
    phoneNumber,
    loading
}) => {

    const [code, setCode] = useState('');

    let useEmail = true;
    if (option !== 'email') {
        useEmail = false;
    }

    return (
        <Container className='ui container' onSubmit={e => {onConfirm(code); e.preventDefault();}}>
            <h1><Translate id='setRecoveryConfirm.pageTitle'/> {useEmail ? 'Email' : 'Phone'}</h1>
            <div className='desc one'><Translate id='setRecoveryConfirm.pageText'/> {useEmail ? email : phoneNumber}</div>
            <Translate>
                {({ translate }) => (
                    <input
                        type='number'
                        placeholder={translate('setRecoveryConfirm.inputPlaceholder')}
                        aria-label={translate('setRecoveryConfirm.inputPlaceholder')}
                        value={code}
                        onChange={e => setCode(e.target.value)}
                    />
                )}
            </Translate>
            <FormButton
                color='blue'
                type='submit'
                disabled={code.length < 6}
                sending={loading}
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