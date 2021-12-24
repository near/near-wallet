import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../common/FormButton';
import RawTokenAmount from "./RawTokenAmount";
import TokenIcon from './TokenIcon';
import Tooltip from '../../common/Tooltip';
const Container = styled.div`
    input {
        color: ${props => props.status === '#ff585d' ? props.status : '#24272A'} !important;
    }


    .available-balance {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        color: ${props => props.status === '#ff585d' ? props.status : ''};

        .balance {
            text-align: right;
        }

        >span {
            display: flex;
            align-items: center; 
        }
    }

    .clickable-balance {
        cursor: pointer;
    }

    .amount-header-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 30px 0 10px 0;
    
        h4 {
            margin: 0;
        }
    
        button {
            margin: 0 !important;
            width: auto !important;
            text-decoration: none !important;
            font-weight: 500 !important;
            text-transform: capitalize !important;
        }
    }
`;

const InputIconContainer = styled.div`
    display: flex;
    align-items: center;
    > div {
        margin: 0 5px;
    }

    .icon {
        img, svg {
            height: 32px;
            width: 32px;
        }
    }
`;

export default function AmountInput({
    value, onChange, onSetMaxAmount, valid, disabled,
    tokenInfo, availableClick = null, inputTestId,
    amountHeader, autoFocus, amountTestId

}) {
    let validationStatus;
    if (valid) {
        validationStatus = '#6AD1E3';
    } else {
        validationStatus = '#ff585d';
    }
    const clickableClassName = availableClick !== null ? 'clickable-balance' : '';

    return (

        <Container status={validationStatus} hasValue={value.length}>

            {!disabled ? (
                <div className='amount-header-wrapper'>
                    <h4><Translate id={amountHeader} /></h4>
                    <FormButton
                        className="light-blue small"
                        type='button'
                        onClick={onSetMaxAmount}
                        data-test-id="stakingPageUseMaxButton"
                    >
                        <Translate id="wrapNear.enterAmount.useMax" />
                    </FormButton>
                </div>
            ) :
                <div className='amount-header-wrapper'>
                    <h4><Translate id={amountHeader} /></h4>
                </div>
            }
            <InputIconContainer>
                <input
                    disabled={disabled}
                    type='number'
                    autoFocus={!value ? autoFocus : false}
                    placeholder='0'
                    step='any'
                    value={value}
                    onChange={e => onChange(e)}
                    className='wrap-amount-input'
                    data-test-id={inputTestId}
                />
                <div className='icon'>
                    <TokenIcon symbol={tokenInfo.symbol}
                        icon={tokenInfo.icon} />
                </div>
            </InputIconContainer>

            <div className={"available-balance"}>
                <span>
                    <Translate id={`wrapNear.enterAmount.availableBalance`} />
                    {
                        tokenInfo.symbol == "NEAR" ?
                            (<Tooltip translate='availableBalanceInfo' />) :
                            null
                    }

                </span>
                <div onClick={availableClick} className={clickableClassName}>
                    <RawTokenAmount
                        symbol={tokenInfo.symbol}
                        amount={tokenInfo.balance}
                        decimals={tokenInfo.decimals}
                        showFiatAmountForNonNearToken={false}
                        testId={amountTestId}
                    />
                </div>
            </div>
        </Container>
    );
}