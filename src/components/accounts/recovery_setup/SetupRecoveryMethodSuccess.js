import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux'

import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css'
import LedgerConfirmActionModal from '../ledger/LedgerConfirmActionModal'

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

const SetRecoveryMethodSuccess = ({
    option,
    onConfirm,
    onGoBack,
    email,
    phoneNumber,
    loading,
    requestStatus,
    showModal,
    onClose
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
                <h1><Translate id='setRecoveryConfirm.pageTitle'/> {useEmail ? 'Email' : 'Phone'}</h1>
                <h2><Translate id='setRecoveryConfirm.pageText'/> {useEmail ? email : phoneNumber}</h2>
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
                    <Translate id='button.confirm' />
                </FormButton>
            </form>
            <div className='re-enter'>
                <Translate id={`setRecoveryConfirm.reenter.one.${useEmail ? 'email' : 'phoneNumber'}`} />
                <span onClick={onGoBack} className='link'><Translate id='setRecoveryConfirm.reenter.link'/></span>
                <Translate id={`setRecoveryConfirm.reenter.two.${useEmail ? 'email' : 'phoneNumber'}`} />
            </div>

            {showModal && (
                <LedgerConfirmActionModal 
                    open={true}
                    onClose={() => onClose()} 
                    textId='confirmLedgerModal.one'
                />
            )}
        </StyledContainer>
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