import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../components/common/FormButton';
import SafeTranslate from '../../../components/SafeTranslate';
import AvatarSuccessIcon from '../../../components/svg/AvatarSuccessIcon';
import FailIcon from '../../../components/svg/FailIcon';
import { toSignificantDecimals } from '../../../utils/amounts';
import { useSwapData } from '../model/Swap';
import { DECIMALS_TO_SAFE } from '../utils/constants';

const StyledContainer = styled.div`
    > svg {
        margin: 30px auto;
        display: block;
    }
`;

const StyledHeader = styled.div`
    text-align: center;
    line-height: 140%;
    color: #272729;
    font-weight: 600;
    font-size: 20px;
`;

const FailTitle = styled.div`
    margin-bottom: 1rem;
`;

const Reason = styled.p`
    font-weight: 400;
`;

const ButtonsWrapper = styled.div`
    margin-top: 55px;

    > button {
        display: block;
        width: 100%;
    }
`;

const noop = () => {};

export default function Success({ onClickContinue = noop, onClickGoToExplorer }) {
    const {
        swapState: { tokenIn, amountIn, tokenOut, amountOut, lastSwapState = {} },
    } = useSwapData();

    const { success, hash: swapHash, failReason } = lastSwapState;

    const successData = {
        amountFrom: `${toSignificantDecimals(amountIn, DECIMALS_TO_SAFE)} ${
            tokenIn?.onChainFTMetadata?.symbol
        }`,
        amountTo: `${toSignificantDecimals(amountOut, DECIMALS_TO_SAFE)} ${
            tokenOut?.onChainFTMetadata?.symbol
        }`,
    };

    return (
        <StyledContainer className="buttons-bottom">
            {success ? (
                <>
                    <AvatarSuccessIcon />
                    <StyledHeader>
                        <SafeTranslate
                            id="swap.successTitle"
                            data={successData}
                            data-test-id="swapPageSuccessMessage"
                        />
                    </StyledHeader>
                </>
            ) : (
                <>
                    <FailIcon />
                    <StyledHeader>
                        <FailTitle>
                            <SafeTranslate id="swap.failTitle" />
                        </FailTitle>
                        {failReason && (
                            <Reason className="font-monospace">{failReason}</Reason>
                        )}
                    </StyledHeader>
                </>
            )}
            <ButtonsWrapper>
                <FormButton
                    data-test-id="swapPageContinueAfterSwapButton"
                    onClick={onClickContinue}
                >
                    <Translate id="button.continue" />
                </FormButton>

                {swapHash && (
                    <FormButton color="gray-gray" onClick={onClickGoToExplorer}>
                        <Translate id="button.viewOnExplorer" />
                    </FormButton>
                )}
            </ButtonsWrapper>
        </StyledContainer>
    );
}
