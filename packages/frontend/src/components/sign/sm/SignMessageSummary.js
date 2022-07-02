import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../common/FormButton';
import FormButtonGroup from '../../common/FormButtonGroup';
import Container from '../../common/styled/Container.css';
import ConnectWithApplication from '../../login/v2/ConnectWithApplication';
import SignMessage from './SignMessage';

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
    accountLocalStorageAccountId,
    onClickCancel,
    onClickApprove,
    onClickMoreInformation,
    accountUrlReferrer,
    signingMessage,
    isValidCallbackUrl
}) => {
    return (
        <StyledContainer className='small-centered border'>
            <h3><Translate id='sign.approveSignMessage' /></h3>
            <ConnectWithApplication appReferrer={accountUrlReferrer} />

            <SignMessage
                sender={accountLocalStorageAccountId}
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
                    disabled={signingMessage || !isValidCallbackUrl}
                >
                    <Translate id='button.cancel' />
                </FormButton>
                <FormButton
                    onClick={onClickApprove}
                    disabled={signingMessage || !isValidCallbackUrl }
                    sending={signingMessage}
                >
                    <Translate id='button.approve' />
                </FormButton>
            </FormButtonGroup>
        </StyledContainer>
    );
};
