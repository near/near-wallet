import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import ArrowUpImage from '../../images/icon-arrow-up-green.svg';
import RetryImage from '../../images/icon-retry-tx.svg';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';

const CustomContainer = styled(Container)`
    max-width: 450px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #25282A;
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
        margin-top: 40px;

        button {
            flex: 1;

            &:last-of-type {
                margin-left: 30px;

                @media (min-width: 768px) {
                    margin-left: 50px;
                }
            }
        }
    }

    .fees {
        width: 100%;
        border: 1px solid #F0F0F1;
        padding: 15px;
        border-radius: 8px;
        margin-top: 30px;
        color: #72727A;

        b {
            color: #25282A;
        }

        .fees-line {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 12px;

            .tgas {
                color: #00C08B;
                position: relative;

                :after {
                    content: '';
                    position: absolute;
                    background: url(${ArrowUpImage}) center top no-repeat;
                    width: 16px;
                    height: 17px;
                    left: -22px;
                    top: 1px;
                }
            }
        }
    }
`;

const SignTransferRetry = ({ handleRetry, handleCancel, gasLimit }) => (
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
        <div className='fees'>
            <div className='fees-line'>
                <b><Translate id='sign.retry.networkFees' /></b>
            </div>
            <div className='fees-line'>
                <Translate id='sign.retry.estimatedFees' />
                <div>NEAR</div>
            </div>
            <div className='fees-line'>
                <Translate id='sign.retry.feeLimit' />
                <div className='tgas'>
                    {gasLimit} Tgas
                </div>
            </div>
        </div>
        <div className='buttons'>
            <FormButton
                onClick={handleCancel}
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
