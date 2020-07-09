import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux'
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css'

const StyledContainer = styled(Container)`
    .recover-value {
        background-color: #f8f8f8;
        padding: 3px 10px;
        color: #24272a;
    }
    .re-enter {
        border-top: 2px solid #f8f8f8;
        margin-top: 30px;
        padding-top: 10px;
        line-height: normal;
    }
    input {
        width: 100%;
        margin-top: 30px !important;
    }

    button {
        width: 100% !important;
        margin-top: 40px !important;
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
        <StyledContainer className='small-centered'>
            <form onSubmit={e => {onConfirm(code); e.preventDefault();}} autoComplete='off'>
                <h1><Translate id='setRecoveryConfirm.title'/></h1>
                <h2><Translate id='setRecoveryConfirm.pageText' data={{option}}/> <span>{useEmail ? email : phoneNumber}</span></h2>
                <h4><Translate id='setRecoveryConfirm.inputHeader'/></h4>
                <Translate>
                    {({ translate }) => (
                        <>
                            <input
                                type='number'
                                pattern='[0-9]*'
                                placeholder={translate('setRecoveryConfirm.inputPlaceholder')}
                                aria-label={translate('setRecoveryConfirm.inputPlaceholder')}
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
            </form>
            <p><Translate id='setRecoveryConfirm.didNotRecive'/> <span onClick={onResend} className='link'><Translate id='setRecoveryConfirm.resendCode'/></span>, <Translate id='setRecoveryConfirm.or'/> <span onClick={onGoBack} className='link'><Translate id='setRecoveryConfirm.sendToDifferent'/></span>.</p>
        </StyledContainer>
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