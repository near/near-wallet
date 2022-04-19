<<<<<<< HEAD
import React from "react";
import { Translate } from "react-localize-redux";
import styled from "styled-components";
import { formatTokenAmount } from "../../utils/amounts";
import { formatNearAmount } from "../common/balance/helpers";
import FormButton from "../common/FormButton";
=======
import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { formatTokenAmount } from '../../utils/amounts';
import { formatNearAmount } from '../common/balance/helpers';
import FormButton from '../common/FormButton';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

const StyledAvailableContainer = styled.div`
    display:flex;
    padding-left: 4px;
    justify-content:space-between;
    align-items: center;
    text-align: right;
    width: 100%;
    margin-top: 5px;
    color: #252729;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 15px;

    span {
        color: green;
        cursor: pointer;
    }
`;

function AvailableToSwap({ balance, symbol, decimals, onClick }) {
    const amountoShow = balance && formatNearAmount(balance);

    return (
        <StyledAvailableContainer>
            <div>
<<<<<<< HEAD
                <Translate id="swap.AvailableToSwap" />{" "}
                    <span>
                        {balance ? (
                        <>
                            {" "}
                            {symbol === "NEAR"
=======
                <Translate id="swap.AvailableToSwap" />{' '}
                    <span>
                        {balance ? (
                        <>
                            {' '}
                            {symbol === 'NEAR'
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
                            ? amountoShow
                            : formatTokenAmount(balance, decimals, 5)}
                        </>
                            ) : (
                    <span className="dots" />
<<<<<<< HEAD
                )}{" "}
=======
                )}{' '}
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
                <>{symbol}</>
            </span>
            </div>
            <div>
                <FormButton
                swapButton={true}
<<<<<<< HEAD
                onClick={() => onClick(symbol === "NEAR" ? amountoShow : formatTokenAmount(balance, decimals, 5))}
=======
                onClick={() => onClick(symbol === 'NEAR' ? amountoShow : formatTokenAmount(balance, decimals, 5))}
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
                type='button'
                color='light-blue'
                className='small rounded'
                >
                    <Translate id='button.useMax'/>
                </FormButton>                
            </div>
           
        </StyledAvailableContainer>
    );
}

export default AvailableToSwap;
