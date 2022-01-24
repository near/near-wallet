import BN from 'bn.js';
import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import AlertBanner from '../../common/AlertBanner';
import FormButton from '../../common/FormButton';
import FormButtonGroup from '../../common/FormButtonGroup';
import Container from '../../common/styled/Container.css';
import ConnectWithApplication from '../../login/v2/ConnectWithApplication';
import SignTransaction from './SignTransaction';

const StyledContainer = styled(Container)`
    &&& {
        h3 {
            color: #272729;
            text-align: center;
        }
    
        > button {
            &.link {
                font-weight: normal;
                margin: 25px auto 0 auto;
                display: block;
                :before {
                    content: '+';
                    letter-spacing: 5px;
                }
            }
        }

        .button-group {
            margin-top: 25px;
        }

        .connect-with-application {
            margin: 20px auto 30px auto;
        }

        .alert-banner {
            margin: 20px 0;
            border-radius: 4px;
        }
    }
`;

export default ({
    transferAmount,
    accountLocalStorageAccountId,
    availableBalance,
    estimatedFees,
    onClickCancel,
    onClickApprove,
    onClickMoreInformation,
    onClickEditAccount,
    accountUrlReferrer,
    submittingTransaction
}) => {
    const insufficientBalance = availableBalance && transferAmount && new BN(availableBalance).lt(new BN(transferAmount));
    return (
        <StyledContainer className='small-centered border'>
            <h3><Translate id='sign.approveTransaction' /></h3>
            <ConnectWithApplication appReferrer={accountUrlReferrer} />
            {insufficientBalance &&
                <AlertBanner
                    title='sign.insufficientFundsDesc'
                    theme='warning'
                />
            }
            <SignTransaction
                transferAmount={transferAmount}
                sender={accountLocalStorageAccountId}
                estimatedFees={estimatedFees}
                availableBalance={availableBalance}
                onClickEditAccount={onClickEditAccount}
            />
            <FormButton
                className='link'
                onClick={onClickMoreInformation}
            >
                <Translate id='button.moreInformation' />
            </FormButton>
            <FormButtonGroup>
                <FormButton
                    color='gray-blue'
                    onClick={onClickCancel}
                    disabled={submittingTransaction}
                >
                    <Translate id='button.cancel' />
                </FormButton>
                <FormButton
                    onClick={onClickApprove}
                    disabled={submittingTransaction || insufficientBalance}
                    sending={submittingTransaction}
                >
                    <Translate id='button.approve' />
                </FormButton>
            </FormButtonGroup>
        </StyledContainer>
    );
};