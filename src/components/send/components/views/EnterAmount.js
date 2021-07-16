import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import AmountInput from '../AmountInput';
import BalanceDetails from '../BalanceDetails';
import SelectTokenButton from '../SelectTokenButton';
import TabSelector from '../TabSelector';

const StyledContainer = styled.form`
    &&& {
        > button {
            &.light-blue {
                margin: 0 auto;
                display: block;
            }
        }

        > input {
            margin: 55px 0px 15px;
        }

        > div {
            :nth-of-type(2) {
                margin: 55px 0 5px 0;
            }
        }
    }
`;

const EnterAmount = ({ 
    amount,
    onChangeAmount,
    onSetMaxAmaount,
    availableToSend,
    availableBalance,
    reservedForFees,
    continueAllowed,
    onContinue,
    onClickCancel,
    selectedToken,
    onClickSelectToken,
    error
}) => {

    return (
        <StyledContainer 
            className='buttons-bottom enter-amount'
            onSubmit={(e) => {onContinue(e); e.preventDefault();}}
            novalidate
        >
            <TabSelector/>
            <AmountInput
                value={amount}
                onChange={onChangeAmount}
                error={error}
            />
            <FormButton
                onClick={onSetMaxAmaount}
                type='button'
                color='light-blue'
                className='small rounded'
            >
                <Translate id='button.useMax'/>
            </FormButton>
            <SelectTokenButton
                token={selectedToken}
                onClick={onClickSelectToken}
            />
            <BalanceDetails
                availableToSend={availableToSend}
                availableBalance={availableBalance}
                reservedForFees={reservedForFees}
                selectedToken={selectedToken}
            />
            <div className='buttons-bottom-buttons'>
                {/* TODO: Add error state */}
                <FormButton
                    type='submit'
                    color='dark-gray'
                    disabled={!continueAllowed}
                >
                    <Translate id='button.continue'/>
                </FormButton>
                <FormButton
                    type='button'
                    onClick={onClickCancel}
                    className='link'
                    color='gray'
                >
                    <Translate id='button.cancel'/>
                </FormButton>
            </div>
        </StyledContainer>
    );
};

export default EnterAmount;