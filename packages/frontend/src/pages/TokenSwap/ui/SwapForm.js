import Big from 'big.js';
import React, { useState, memo, useMemo, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import BackArrowButton from '../../../components/common/BackArrowButton';
import FlipButton from '../../../components/common/FlipButton';
import FormButton from '../../../components/common/FormButton';
import SelectToken from '../../../components/send/components/views/SelectToken';
import { NEAR_ID } from '../../../config';
import { selectAvailableBalance } from '../../../redux/slices/account';
import { formatTokenAmount } from '../../../utils/amounts';
import { NEAR_DECIMALS } from '../../../utils/constants';
import isMobile from '../../../utils/isMobile';
import { useSwapData, VIEW_STATE } from '../model/Swap';
import { DEFAULT_OUTPUT_TOKEN_ID, NOTIFICATION_TYPE } from '../utils/constants';
import useSwapInfo from '../utils/hooks/useSwapInfo';
import Input from './Input';
import Notification from './Notification';
import SwapDetails from './SwapDetails/SwapDetails';

const mobile = isMobile();

const SwapFormWrapper = styled.div`
    // Styles for the <SelectToken /> component.
    // We use the same styles in the old swap components.
    // @todo find a way to use it in one place.
    // Can we put it in <SelectToken /> ?
    div.header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #272729;
        font-weight: 600;
        font-size: 20px;
        word-break: break-all;

        .back-arrow-button {
            position: absolute;
            left: 0;
        }
    }
`;

const Header = styled.div`
    margin-bottom: 2.125rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    .title {
        font-family: "Inter";
        font-style: normal;
        font-size: 1.25rem;
        line-height: 1.5rem;
        text-align: center;
        font-weight: 700;
        margin: auto;
    }
`;

const SwapButtonWrapper = styled.div`
    margin: 0.8rem 0;
    display: flex;
    justify-content: center;
`;

const Footer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 0.8rem;

    button {
        width: 100%;
    }

    .cancel-button-wrapper {
        margin-top: 1rem;
    }
`;

const tokenSelectState = {
    noSelect: 0,
    selectIn: 1,
    selectOut: 2,
};

const SwapForm = memo(({ onGoBack, account, tokensConfig  }) => {
    const availableBalance = useSelector(selectAvailableBalance);
    const { tokensIn, listOfTokensIn, tokensOut, listOfTokensOut } = tokensConfig;
    const {
        swapState: {
            tokenIn,
            tokenOut,
            amountIn,
            isNearTransformation,
            amountOut,
            swapPoolId,
            estimatedFee,
        },
        events: {
            setViewState,
            setTokenIn,
            setTokenOut,
            setAmountIn,
            setAmountOut,
        },
    } = useSwapData();

    useEffect(() => {
        if (!tokenIn && listOfTokensIn[0]) {
            setTokenIn(listOfTokensIn[0]);
        } else {
            const newTokenIn = tokensIn[tokenIn?.contractName] || tokensOut[tokenIn?.contractName];

            setTokenIn(newTokenIn);
        }
    }, [listOfTokensIn]);

    useEffect(() => {
        if (!tokenOut) {
            setTokenOut(tokensOut[DEFAULT_OUTPUT_TOKEN_ID] || listOfTokensOut[1]);
        } else {
            setTokenOut(tokensOut[tokenOut?.contractName]);
        }
    }, [listOfTokensOut]);

    const onClickReview = () => setViewState(VIEW_STATE.preview);

    const [displayTokenSelect, setDisplayTokenSelect] = useState(
        tokenSelectState.noSelect
    );
    const tokensToSelect = useMemo(() => {
        if (!displayTokenSelect) {
            return [];
        }

        return displayTokenSelect === tokenSelectState.selectIn
            ? listOfTokensIn
            : listOfTokensOut;
    }, [displayTokenSelect, listOfTokensIn, listOfTokensOut]);

    const selectTokenIn = () => setDisplayTokenSelect(tokenSelectState.selectIn);
    const selectTokenOut = () => setDisplayTokenSelect(tokenSelectState.selectOut);
    const hideTokenSelection = () => setDisplayTokenSelect(tokenSelectState.noSelect);

    const handleTokenSelect = (token) => {
        switch (displayTokenSelect) {
            case tokenSelectState.selectIn:
                if (token.contractName === tokenOut.contractName) {
                    setTokenOut(tokenIn);
                }
                setTokenIn(token);
                break;
            case tokenSelectState.selectOut:
                if (token.contractName === tokenIn.contractName) {
                    setTokenIn(tokenOut);
                }
                setTokenOut(token);
                break;
        }

        setDisplayTokenSelect(tokenSelectState.noSelect);
    };

    const handleInputAmountChange = (value) => {
        setAmountIn(value);
        setAmountOut('');
    }; 

    const {
        swapNotification,
        loading,
    } = useSwapInfo({
        account,
        tokenIn,
        amountIn,
        tokenOut,
    });

    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (notification) {
            setNotification(null);
        };

        if (swapNotification) {
            setNotification(swapNotification);
        } else if (estimatedFee && availableBalance) {
            const formattedBalance = formatTokenAmount(availableBalance, NEAR_DECIMALS, NEAR_DECIMALS);

            // If we have NEAR in the input field check is available balance >= amount + swap fee
            if (
                tokenIn?.contractName === NEAR_ID &&
                amountIn &&
                Big(estimatedFee).plus(amountIn).gt(formattedBalance)
            ) {
                setNotification({
                    id: 'swap.insufficientBalanceForAmountAndFee',
                    type: NOTIFICATION_TYPE.warning,
                });
            } else if (Big(estimatedFee).gt(formattedBalance)) {
                setNotification({
                    id: 'swap.insufficientBalanceForFee',
                    type: NOTIFICATION_TYPE.warning,
                });
            }
        }
    }, [tokenIn, amountIn, availableBalance, estimatedFee, swapNotification]);

    const flipInputsData = () => {
        setTokenIn(tokenOut);
        setTokenOut(tokenIn);

        if (amountOut) {
            setAmountIn(amountOut);
        }
    };

    const [isValidInput, setIsValidInput] = useState(false);

    const canSwap = useMemo(() => {
        const formIsFilled = Boolean(
            tokenIn &&
                tokenOut &&
                (swapPoolId || isNearTransformation) &&
                amountIn &&
                amountOut
        );

        if (formIsFilled && availableBalance) {
            const formattedBalance = formatTokenAmount(availableBalance, NEAR_DECIMALS, NEAR_DECIMALS);
            const isInsufficientBalance = Big(estimatedFee)
                .plus(tokenIn?.contractName === NEAR_ID ? amountIn : 0)
                .gt(formattedBalance);

            if (isValidInput && !isInsufficientBalance) {
                return true;
            }
        }

        return false;
    }, [
        tokenIn,
        tokenOut,
        swapPoolId,
        amountIn,
        amountOut,
        isNearTransformation,
        isValidInput,
        estimatedFee,
        availableBalance,
    ]);

    return (
        <SwapFormWrapper>
            {displayTokenSelect ? (
                <SelectToken
                    isMobile={mobile}
                    onClickGoBack={hideTokenSelection}
                    fungibleTokens={tokensToSelect}
                    onSelectToken={handleTokenSelect}
                    balanceLabelId="available"
                />
            ) : (
                <>
                    <Header>
                        <BackArrowButton onClick={onGoBack} />
                        <h4 className="title">
                            <Translate id="swap.title" />
                        </h4>
                    </Header>
                    <Input
                        value={amountIn}
                        onChange={handleInputAmountChange}
                        onSelectToken={selectTokenIn}
                        labelId="swap.from"
                        tokenSymbol={tokenIn?.onChainFTMetadata?.symbol}
                        tokenIcon={tokenIn?.onChainFTMetadata?.icon}
                        tokenDecimals={tokenIn?.onChainFTMetadata?.decimals}
                        maxBalance={tokenIn?.balance}
                        setIsValidInput={setIsValidInput}
                        inputTestId="swapPageInputAmountField"
                        tokenSelectTestId="swapPageInputTokenSelector"
                        autoFocus
                    />
                    <SwapButtonWrapper>
                        <FlipButton onClick={flipInputsData} />
                    </SwapButtonWrapper>
                    <Input
                        value={amountOut}
                        onSelectToken={selectTokenOut}
                        labelId="swap.to"
                        tokenSymbol={tokenOut?.onChainFTMetadata?.symbol}
                        tokenIcon={tokenOut?.onChainFTMetadata?.icon}
                        tokenDecimals={tokenOut?.onChainFTMetadata?.decimals}
                        maxBalance={tokenOut?.balance}
                        loading={loading}
                        inputTestId="swapPageOutputAmountField"
                        tokenSelectTestId="swapPageOutputTokenSelector"
                        disabled
                    />
                    <Footer>
                        <SwapDetails />

                        {notification && (
                            <Notification content={notification} />
                        )}

                        <FormButton
                            disabled={!canSwap}
                            onClick={onClickReview}
                            trackingId="Click Preview swap on Swap page"
                            data-test-id="swapPageSwapPreviewStateButton"
                        >
                            <Translate id="swap.review" />
                        </FormButton>
                        <div className="cancel-button-wrapper">
                            <FormButton color="link gray" onClick={onGoBack}>
                                <Translate id="button.cancel" />
                            </FormButton>
                        </div>
                    </Footer>
                </>
            )}
        </SwapFormWrapper>
    );
});

export default SwapForm;
