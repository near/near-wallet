import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';

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

const TwoFactorVerifyInput = () => {
    return (
        <Container>
            <div className='color-black font-bw'><Translate id='twoFactor.verify.inputLabel'/></div>
            <Translate>
                {({ translate }) => (
                    <input placeholder={translate('twoFactor.verify.placeholder')}/>
                )}
            </Translate>
            <div><Translate id='twoFactor.verify.didntReceive'/> <span className='color-blue'><Translate id='twoFactor.verify.resend'/></span></div>
        </Container>
    )
}

export default TwoFactorVerifyInput;