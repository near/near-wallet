import React from "react";
import { Translate } from "react-localize-redux";
import styled from "styled-components";
import { formatTokenAmount } from "../../utils/amounts";
import { formatNearAmount } from "../common/balance/helpers";

const StyledAvailableContainer = styled.div`
    text-align: right;
    width: 100%;
    margin-top: 5px;
    color: #252729;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 10px;

    span {
        color: green;
        cursor: pointer;
    }
`;

function AvailableToSwap({ balance, symbol, decimals, onClick }) {
    const amountoShow = balance && formatNearAmount(balance);

    return (
        <StyledAvailableContainer>
            <Translate id="swap.AvailableToSwap" />{" "}
            <span onClick={() => onClick(symbol === "NEAR" ? amountoShow : formatTokenAmount(balance, decimals, 5))}>
                {balance ? (
                    <>
                        {" "}
                        {symbol === "NEAR"
                            ? amountoShow
                            : formatTokenAmount(balance, decimals, 5)}
                    </>
                ) : (
                    <span className="dots" />
                )}{" "}
                <>{symbol}</>
            </span>
        </StyledAvailableContainer>
    );
}

export default AvailableToSwap;
