import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { getFormatBalance } from '../../../utils/wrap-unwrap';
import BackArrowButton from '../../common/BackArrowButton';
import FormButton from '../../common/FormButton';
import SwapIcon from '../../svg/WrapIcon';
import SwapFromForm from './SwapFromForm';
import SwapToForm from './SwapToForm';

const StyledContainer = styled.div`
    h4 {
        font-family: "Inter";
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;
        text-align: center;
        font-weight: 900;
        margin: auto;
    }
    div.header {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }
    div.flexCenter {
        display: flex;
        justify-content: center;
    }
    div.flexCenterButton {
        display: flex;
        justify-content: center;
        margin-top: 28px;
    }

    .width100 {
        width: 100%;
    }
    .margin {
        margin-bottom: 20px;
        width 72px;
    }
    .small-rounded {
        border-radius: 50px;
        width: 72px;
        height: 40px;

        background-color: #d6edff;
        border: 0;
        color: #0072ce;

        :hover {
            background-color: #0072ce;
            svg {
                path {
                    fill: #ffffff;
                }
            }
        }
    }
`;

export function SwapAmountForm({
    history,
    onClickReview,
    onClickFromToken,
    onClickToToken,
    amountTokenFrom,
    setAmountTokenFrom,
    amountTokenTo,
    setAmountTokenTo,
    activeTokenFrom,
    setActiveTokenFrom,
    activeTokenTo,
    setActiveTokenTo,
    maxFrom,
    setMaxFrom,
    maxTo,
    setMaxTo,
    error,
    setReversePositionsJustClicked
}) {
    const [isDisabled, setDisabled] = useState(true);
    useEffect(() => {
        if (activeTokenFrom) {
            setMaxFrom(
                getFormatBalance(
                    activeTokenFrom.balance,
                    activeTokenFrom.onChainFTMetadata.decimals
                )
            );
        }
        if (activeTokenTo) {
            setMaxTo(
                getFormatBalance(
                    activeTokenTo.balance,
                    activeTokenTo.onChainFTMetadata.decimals
                )
            );
        }
    }, [activeTokenFrom, activeTokenTo]);

    useEffect(() => {
        if (amountTokenFrom && amountTokenTo && !error) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [amountTokenFrom, amountTokenTo, error]);

    const handleSwapForm = () => {
        const temp = amountTokenTo;
        const tempMax = maxTo;
        const tempToken = activeTokenTo;
        setActiveTokenTo(activeTokenFrom);
        setActiveTokenFrom(tempToken);
        setAmountTokenTo(amountTokenFrom);
        setAmountTokenFrom(temp);
        setMaxTo(maxFrom);
        setMaxFrom(tempMax);
        setReversePositionsJustClicked(true);
    };

    return (
        <StyledContainer>
            <div className="headerSwap">
                <BackArrowButton onClick={() => history.push('/')} />
                <h4>
                    <Translate id="swap.title" />
                </h4>
            </div>
            <SwapFromForm
                onClickFromToken={onClickFromToken}
                maxValue={maxFrom}
                amountToken={amountTokenFrom}
                setAmountToken={setAmountTokenFrom}
                activeTokenFrom={activeTokenFrom}
                error={error}
            />
            <div className="flexCenter">
                <div className="margin">
                    <FormButton
                        color="small-rounded"
                        onClick={handleSwapForm}
                    >
                        <SwapIcon className="hoverFill" />
                    </FormButton>
                </div>
            </div>
            <SwapToForm
                onClickToToken={onClickToToken}
                maxValue={maxTo}
                amountToken={amountTokenTo}
                activeTokenTo={activeTokenTo}
            />

            <div className="flexCenterButton">
                <FormButton
                    disabled={isDisabled}
                    color="blue width width100"
                    onClick={onClickReview}
                >
                    <Translate id="swap.review" />
                </FormButton>
            </div>
            <div className="flexCenterButton">
                <FormButton color="gray link " onClick={() => history.goBack()}>
                    <Translate id="button.cancel" />
                </FormButton>
            </div>
        </StyledContainer>
    );
}
