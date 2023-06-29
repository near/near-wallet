import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../common/FormButton';
import FormButtonGroup from '../common/FormButtonGroup';
import Container from '../common/styled/Container.css';
import VerifyOwner from './VerifyOwner';

const StyledContainer = styled(Container)`
    background-color: ##F0F0F1;
    padding: 25px;
    &&& {
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
    accountId,
    onClickCancel,
    onClickApprove,
    accountUrlReferrer,
    signing,
    message,
    isValidCallbackUrl
}) => {
    return (
        <StyledContainer className='small-centered border brs-8 bsw-l'>
            <VerifyOwner
                accountId={accountId}
                appName={accountUrlReferrer}
                message={message}
            />
            <FormButtonGroup>
                <FormButton
                    color='gray-blue'
                    onClick={onClickCancel}
                    disabled={signing || !isValidCallbackUrl}
                >
                    <Translate id='button.cancel' />
                </FormButton>
                <FormButton
                    onClick={onClickApprove}
                    disabled={signing || !isValidCallbackUrl}
                    sending={signing}
                >
                    <Translate id='button.approve' />
                </FormButton>
            </FormButtonGroup>
        </StyledContainer>
    );
};
