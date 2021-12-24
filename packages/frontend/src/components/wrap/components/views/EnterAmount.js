import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import AmountInput from '../AmountInput';
import SwapArrow from '../../../svg/SwapArrow';


const StyledContainer = styled.form`
    &&& {
        h1, h2 {
            text-align: center !important;
        }

        > button {
            &.light-blue {
                margin: 0 auto;
                display: block;
            }
        }

        .swap_wrap {
            text-align:center;
            margin: 20px 5px auto;
            > span {
                cursor: pointer;
            }
        }
 
    }
`;

const EnterAmount = ({
    amount,
    onChangeAmount,
    onSetMaxAmount,
    continueAllowed,
    onContinue,
    onClickCancel,
    tokenPair,
    onSwapClick,
    error,
    isMobile
}) => {

    const selectedToken = tokenPair[0];
    const toToken = tokenPair[1];

    return (
        <StyledContainer
            className='buttons-bottom'
            onSubmit={(e) => { onContinue(e); e.preventDefault(); }}
            novalidate
        >

            <h1><Translate id={"wrapNear.enterAmount.title"} /></h1>
            <h2><Translate id={"wrapNear.enterAmount.information"} /></h2>

            <AmountInput
                value={amount}
                onChange={onChangeAmount}
                onSetMaxAmount={onSetMaxAmount}
                valid={!error}
                tokenInfo={selectedToken}
                availableClick={onSetMaxAmount}
                disabled={false}
                autoFocus={!isMobile}
                inputTestId="wrappingFromAmountInput"
                amountTestId="wrappingFromAmountInputView"
                amountHeader={"wrapNear.enterAmount.payAmount"}

            />

            <div className={"swap_wrap"} data-test-id={"swapWrappingTokenButton"}>
                <span onClick={onSwapClick}>
                    <SwapArrow />
                </span>
            </div>

            <AmountInput
                value={amount}
                onChange={null}
                onSetMaxAmount={null}
                valid={true}
                tokenInfo={toToken}
                disabled={true}
                autoFocus={false}
                inputTestId="wrappingToAmountInput"
                amountTestId="wrappingToAmountInputView"
                amountHeader={"wrapNear.enterAmount.receiveAmount"}
            />


            <div className='buttons-bottom-buttons'>
                <FormButton
                    type='submit'
                    disabled={!continueAllowed}
                    data-test-id="wrapNearPageSubmitAmountButton"
                >
                    <Translate id='button.continue' />
                </FormButton>
                <FormButton
                    type='button'
                    onClick={onClickCancel}
                    className='link'
                    color='gray'
                >
                    <Translate id='button.cancel' />
                </FormButton>
            </div>
        </StyledContainer>
    );
};

export default EnterAmount;