import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import BackArrowButton from '../../common/BackArrowButton';
import FormButton from '../../common/FormButton';
import SwapIcon from '../../svg/WrapIcon';
import { VIEWS } from '../SwapNear';
import { getFormatBalance } from '../../../utils/wrap-unwrap';
import SwapFromForm from './SwapFromForm';
import SwapFromTo from './SwapFromTo';

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
        margin-bottom: 16px;
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
    match,
    location,
    history,
    setActiveView,
    amountTokenFrom,
    setAmountTokenFrom,
    amountTokenTo,
    setAmountTokenTo,
    mockRateData,
    setMockRateData,
    activeTokenFrom,
    setActiveTokenFrom,
    activeTokenTo,
    setActiveTokenTo,
    maxFrom,
    setMaxFrom,
    maxTo,
    setMaxTo,
    error,
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
        setMockRateData(1 / mockRateData);
    }

    return (
        <StyledContainer>
            <div className="header">
                <BackArrowButton onClick={() => history.push('/')} />
                <h4>
                    <Translate id="swapNear.title" />
                </h4>
            </div>
            <SwapFromForm
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
            <SwapFromTo
                maxValue={maxTo}
                amountToken={amountTokenTo}
                setAmountToken={setAmountTokenTo}
                activeTokenTo={activeTokenTo}
            />

            <FormButton
                disabled={isDisabled}
                color="blue width width100"
                onClick={() => setActiveView(VIEWS.REVIEW)}
            >
                <Translate id="swapNear.review" />
            </FormButton>

            <div className="flexCenterButton">
                <FormButton color="gray link " onClick={() => history.goBack()}>
                    <Translate id="button.cancel" />
                </FormButton>
            </div>
        </StyledContainer>
    );
}
