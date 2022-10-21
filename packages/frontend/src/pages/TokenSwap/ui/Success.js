import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../components/common/FormButton';
import SafeTranslate from '../../../components/SafeTranslate';
import AvatarSuccessIcon from '../../../components/svg/AvatarSuccessIcon';

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

export default function Success({
    tokenIn,
    amountIn,
    tokenOut,
    amountOut,
    transactionHash,
    onClickContinue,
    onClickGoToExplorer,
}) {
    const messageData = {
        amountFrom: `${amountIn} ${tokenIn?.onChainFTMetadata?.symbol}`,
        amountTo: `${amountOut} ${tokenOut?.onChainFTMetadata?.symbol}`,
    };

    return (
        <StyledContainer className='buttons-bottom'>
            <AvatarSuccessIcon />
            <div
                className='success-header'
                data-test-id='swapPageSuccessMessage'
            >
                <SafeTranslate id='swap.successTitle' data={messageData} />
            </div>
            <div className='buttons-bottom-buttons'>
                <FormButton
                    data-test-id='swapPageContinueAfterSwapButton'
                    onClick={onClickContinue}
                >
                    <Translate id='button.continue' />
                </FormButton>

                {transactionHash && (
                    <FormButton color='gray-gray' onClick={onClickGoToExplorer}>
                        <Translate id='button.viewOnExplorer' />
                    </FormButton>
                )}
            </div>
        </StyledContainer>
    );
}
