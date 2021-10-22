import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../common/FormButton';
import FormButtonGroup from '../../common/FormButtonGroup';
import Container from '../../common/styled/Container.css';
import Transaction from './Transaction';

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
    }
`;

export default ({
    transferAmount,
    sender,
    estimatedFees,
    onClickCancel,
    onClickApprove,
    onClickMoreInformation
}) => {
    return (
        <StyledContainer className='small-centered border'>
            <h3><Translate id='sign.v2.approveTransaction.title' /></h3>
            <Transaction
                transferAmount={transferAmount}
                sender={sender}
                estimatedFees={estimatedFees}
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
                >
                    <Translate id='button.cancel' />
                </FormButton>
                <FormButton
                    onClick={onClickApprove}
                >
                    <Translate id='button.approve' />
                </FormButton>
            </FormButtonGroup>
        </StyledContainer>
    );
};