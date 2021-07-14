import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import AmountInput from '../AmountInput';
import BalanceDetails from '../BalanceDetails';
import SelectTokenButton from '../SelectTokenButton';
import TabSelector from '../TabSelector';

const StyledContainer = styled.div`
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
    onGoBack,
    selectedToken,
    onClickSelectToken
}) => {

    return (
        <StyledContainer className='buttons-bottom enter-amount'>
            <TabSelector/>
            <AmountInput
                value={amount}
                onChange={onChangeAmount}
            />
            <FormButton
                onClick={onSetMaxAmaount}
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
            <div className='main-buttons-container'>
                <FormButton
                    color='dark-gray'
                    onClick={onContinue}
                    disabled={!continueAllowed}
                >
                    <Translate id='button.continue'/>
                </FormButton>
                <FormButton
                    onClick={onGoBack}
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