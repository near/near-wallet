import React from "react";
import { Translate } from "react-localize-redux";
import styled from "styled-components";
import classNames from "../../utils/classNames";

const StyledInfoItem = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
        
    > span {
        position: absolute;
        top: 12px;
        right: 5px;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #252729;
    }

    input {
        width: 67px;
        height: 26px;
        background: #ffffff;
        border: 1px solid #f1f0f0;
        box-sizing: border-box;
        border-radius: 60px;
        text-align: right;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #252729;
        padding-right: 18px;
    }

    .left_text {
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 32px;
        color: #252729;
    }

    .right_text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 32px;
        text-align: right;
        color: #252729;
        position: relative;
        min-width: 0px;
        
        &.dots {
            ::after {
                position: absolute;
                left: -14px;
                top: -1.5px;
                content: '.';
                animation: link 1s steps(5, end) infinite;
                @keyframes link {
                    0%,
                    20% {
                        color: rgba(0, 0, 0, 0);
                        text-shadow: 0.3em 0 0 rgba(0, 0, 0, 0),
                            0.6em 0 0 rgba(0, 0, 0, 0);
                    }
                    40% {
                        color: #24272a;
                        text-shadow: 0.3em 0 0 rgba(0, 0, 0, 0),
                            0.6em 0 0 rgba(0, 0, 0, 0);
                    }
                    60% {
                        text-shadow: 0.3em 0 0 #24272a,
                            0.6em 0 0 rgba(0, 0, 0, 0);
                    }
                    80%,
                    100% {
                        text-shadow: 0.3em 0 0 #24272a, 0.6em 0 0 #24272a;
                    }
                }
            }
        }
    }
    .slipPageError {
        color: #ec6563;
        margin-top: 5px;
    }
`;

function SwapInfoItem({
    leftText,
    rightText,
    slippPageValue,
    setSlippPageValue,
    slipPageError,
    tradinFree={tradinFree},
    isDots =false
}) {
    return (
        <StyledInfoItem >
            <div className="left_text">
                <Translate id={leftText} />
            </div>
            {slipPageError && (
                <div className="slipPageError">
                    <Translate id="swap.slipPageError" />
                </div>
            )}
            {setSlippPageValue ? (
                <>
                    <input
                        value={slippPageValue && slippPageValue}
                        onChange={(e) =>
                            setSlippPageValue &&
                            setSlippPageValue(+e.target.value)
                        }
                    />
                    <span>%</span>
                </>
            ) : (
                <div className={classNames({
                    'dots': isDots,
                    'right_text': true
                })}>
                    {rightText && `${rightText}`}
                </div>
            )}
        </StyledInfoItem>
    );
}

export default SwapInfoItem;
