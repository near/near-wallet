import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import RetryImage from '../../images/icon-retry-tx.svg';
import FormButton from '../common/FormButton';

const CustomContainer = styled.div`
    text-align: center;

    .title {
        margin-top: 24px;

        h2 {
            font-weight: 900;
            font-size: 22px;
            color: #24272a;
        }
    }
    && .text {
        color: #72727A;
        margin-top: 24px;
    }
    .buttons {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: stretch;
        margin-top: 24px;

        button {
            width: 100%;
        }

        button:first-child {
            margin-right: 16px;
        }
    }


`;

// TODO: Why handleDeny? It's not an error.
const SignTransferRetry = ({ handleRetry }) => (
    <CustomContainer>
        <div className='icon'>
            <img src={RetryImage} alt='Retry' />
        </div>
        <div className='title'>
            <h2><Translate id='sign.retry.title' /></h2>
        </div>
        <div className='text'>
            <Translate id='sign.retry.text' />
            <br/><br/>
            <a href='https://'>
                <Translate id='sign.retry.link' />
            </a>
        </div>
        <div className='buttons'>
            <FormButton
                color='gray-blue'
            >
                <Translate id='button.cancel' />
            </FormButton>
            <FormButton
                onClick={handleRetry}
            >
                <Translate id='button.resubmit' />
            </FormButton>
        </div>
    </CustomContainer>
);

export default SignTransferRetry;
