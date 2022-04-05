import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import DangerIcon from '../../images/icon-danger-circle.svg';
import { isUrlNotJavascriptProtocol } from '../../utils/helper-api';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import SafeTranslate from '../SafeTranslate';

const CustomContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #25282a;
    text-align: center;

    .title {
        margin-top: 23px;

        h2 {
            font-weight: 900;
            font-size: 22px;
            color: #24272a;
        }
    }

    && .text {
        color: #72727a;
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
`;

const SignTransferMultipleAccounts = ({
    handleCancel,
    signCallbackUrl,
    submittingTransaction,
    signTransactionSignerId,
}) => (
    <CustomContainer className='small-centered'>
        <div className='icon'>
            <img src={DangerIcon} alt='Retry' />
        </div>
        <div className='title'>
            <h2>
                <Translate id='sign.multipleAccountsError.title' />
            </h2>
        </div>
        <div className='text' >
            <SafeTranslate
                id='sign.multipleAccountsError.body'
                data={{ signCallbackUrl, signTransactionSignerId }}
            />
        </div>
        <div className='buttons'>
            <FormButton
                onClick={handleCancel}
                disabled={submittingTransaction}
                color='gray-blue'
            >
                <Translate id='button.cancel' />
            </FormButton>
            <FormButton
                onClick={() => {
                  if (isUrlNotJavascriptProtocol(signCallbackUrl)) {
                    window.location.href = signCallbackUrl;
                  }
                }}
                disabled={submittingTransaction}
                sending={submittingTransaction}
            >
                <Translate id='button.returnToApp' />
            </FormButton>
        </div>
    </CustomContainer>
);

export default SignTransferMultipleAccounts;
