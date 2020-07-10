import React, { useState } from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import FormButton from '../../common/FormButton';

const Container = styled.div`
    max-width: 350px;
    width: 100%;
    margin: 40px 0;

    .color-black {
        font-weight: 500;
    }

    div {
        :last-of-type {
            font-weight: 300;
            margin-top: 10px;

            span {
                font-weigth: 400;
                cursor: pointer;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
`

const TwoFactorVerifyInput = ({
    onChange,
    onResend,
    code,
    error,
}) => {

    return (
        <Container>
            <div className='color-black font-bw'><Translate id='twoFactor.verify.inputLabel'/></div>
            <Translate>
                {({ translate }) => (
                    <>
                        <input
                            type='number'
                            pattern='[0-9]*'
                            inputMode='numeric'
                            placeholder={translate('setRecoveryConfirm.inputPlaceholder')}
                            aria-label={translate('setRecoveryConfirm.inputPlaceholder')}
                            value={code}
                            onChange={e => onChange(e.target.value)}
                        />
                        {error && code.length > 0 &&
                            <div style={{color: '#ff585d', marginTop: '5px'}}>
                                {translate('setRecoveryConfirm.invalidCode')}
                            </div>
                        }
                    </>
                )}
            </Translate>
            <div onClick={onResend}><Translate id='twoFactor.verify.didntReceive'/> <span className='color-blue'><Translate id='twoFactor.verify.resend'/></span></div>
        </Container>
    )
}

export default TwoFactorVerifyInput;