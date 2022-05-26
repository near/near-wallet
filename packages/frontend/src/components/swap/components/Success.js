import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../common/FormButton';
import SafeTranslate from '../../SafeTranslate';
import AvatarSuccessIcon from '../../svg/AvatarSuccessIcon';

const StyledContainer = styled.div`
    > svg {
        margin: 30px auto;
        display: block;
    }

    div.buttons-bottom-buttons {
        margin-top: 55px;

        > button {
            display: block;
            width: 100%;
        }

        .link {
            display: block;
            margin: 20px auto;
        }
    }
    div.success-header span.space {
        white-space: nowrap;
    }
    div.success-header {
        text-align: center;
        line-height: 140%;
        color: #272729;
        font-weight: 600;
        font-size: 20px;
        word-break: break-all;
    }
`;

const Success = ({ amount, tokenTo, transactionHash, onClickContinue, onClickGoToExplorer }) => {
    return (
        <StyledContainer className="buttons-bottom">
            <AvatarSuccessIcon />
            <div
                className="success-header"
                data-test-id="sendTransactionSuccessMessage"
            >
                <SafeTranslate
                    id="swap.successTitle"
                    data={{
                        amount: amount,
                        tokenTo: tokenTo,
                    }}
                />
            </div>
            <div className="buttons-bottom-buttons">
                <FormButton onClick={onClickContinue}>
                    <Translate id="button.continue" />
                </FormButton>
                {transactionHash && (
                    <FormButton color="gray-gray" onClick={onClickGoToExplorer}>
                        <Translate id="button.viewOnExplorer" />
                    </FormButton>
                )}
            </div>
        </StyledContainer>
    );
};

export default Success;
