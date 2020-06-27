import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux'
import FormButton from '../common/FormButton';

const Container = styled.form`
    display: flex !important;
    flex-direction: column;
    align-items: flex-start;

    h2 {
        max-width: 800px;
        color: #4a4f54 !important;

        @media (max-width: 767px) {
            font-size: 14px !important;
            line-height: 18px !important;
            color: #999 !important;
            margin-bottom: -15px;
        }

        span {
            color: #24272a;
        }
    }

    h4 {
        margin-top: 40px;
    }

    p {
        margin-top: 40px;
    }

    .recover-value {
        background-color: #f8f8f8;
        padding: 3px 10px;
        color: #24272a;
    }

    input {
        width: 100%;
        margin-top: 20px !important;

        @media (min-width: 768px) {
            max-width: 288px;
        }
    }
`

const EnterVerificationCode = ({
    option,
    onConfirm,
    onGoBack,
    onResend,
    email,
    phoneNumber,
    loading,
    requestStatus
}) => {

    const [code, setCode] = useState('');

    let useEmail = true;
    if (option !== 'email') {
        useEmail = false;
    }

    const invalidCode = requestStatus && requestStatus.messageCode === 'account.setupRecoveryMessage.error';

    return (
        <Container className='ui container' onSubmit={e => {onConfirm(code); e.preventDefault();}}>
            <h1><Translate id='setRecoveryConfirm.title'/></h1>
            <h2><Translate id='setRecoveryConfirm.pageText' data={{option}}/> <span>{useEmail ? email : phoneNumber}</span></h2>
            <h4><Translate id='setRecoveryConfirm.inputHeader'/></h4>
            <Translate>
                {({ translate }) => (
                    <>
                        <input
                            type='number'
                            pattern='[0-9]*'
                            inputMode='numeric'
                            placeholder='Verification Code'
                            aria-label='Verification Code'
                            value={code}
                            onChange={e => setCode(e.target.value)}
                        />
                        {invalidCode && 
                            <div style={{color: '#ff585d', marginTop: '5px'}}>
                                {translate('setRecoveryConfirm.invalidCode')}
                            </div>
                        }
                    </>
                )}
            </Translate>
            <FormButton
                color='blue'
                type='submit'
                disabled={code.length !== 6 || loading}
                sending={loading}
            >
                <Translate id='button.verifyCodeEnable' />
            </FormButton>
            <p><Translate id='setRecoveryConfirm.didNotRecive'/> <span onClick={onResend} className='link'><Translate id='setRecoveryConfirm.resendCode'/></span>, <Translate id='setRecoveryConfirm.or'/> <span onClick={onGoBack} className='link'><Translate id='setRecoveryConfirm.sendToDifferent'/></span>.</p>
        </Container>
    )
}

EnterVerificationCode.propTypes = {
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    option: PropTypes.string.isRequired,
    onGoBack: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
}

export default EnterVerificationCode;