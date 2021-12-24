import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import SafeTranslate from '../../../SafeTranslate';
import AvatarSuccessIcon from '../../../svg/AvatarSuccessIcon';

const StyledContainer = styled.div`
    > svg {
        margin: 30px auto;
        display: block;
    }

    .header {
        text-align: center;
        line-height: 140%;
    }
`;

const Success = ({
    amountStr,
    receiveAmountStr,
    isWrapping,
    onClickContinue,
    onClickGoToExplorer
}) => {

    return (
        <StyledContainer className='buttons-bottom'>
            <AvatarSuccessIcon />
            <div
                className="header"
                data-test-id="wrapNearTransactionSuccessMessage"
            >
                <SafeTranslate id={isWrapping ? 'wrapNear.success.wrappingTitle' : 'wrapNear.success.unwrappingTitle'}
                    data={{
                        amount: amountStr,
                        receiveAmount: receiveAmountStr
                    }}
                />
            </div>
            <div className='buttons-bottom-buttons'>
                <FormButton
                    onClick={onClickContinue}
                >
                    <Translate id='button.continue' />
                </FormButton>
                <FormButton
                    color='gray-gray'
                    onClick={onClickGoToExplorer}
                >
                    <Translate id='button.viewOnExplorer' />
                </FormButton>
            </div>
        </StyledContainer>
    );
};

export default Success;