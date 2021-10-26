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

        button {
            font-weight: 400;
        }
        span {
            color: #0072ce;
        }
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
            <h2>Insufficient Network Fee</h2>
        </div>
        <div className='text'>
            The default network fee was not enough to cover the cost of your transaction.
            <br/><br/>
            You may resubmit the transaction to have its fee limit automatically increased.
            <br/><br/>
            <span>
                What is the fee limit?
            </span>
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
