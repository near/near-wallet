import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Balance from '../../../common/balance/Balance';
import FormButton from '../../../common/FormButton';
import AmountInput from '../AmountInput';
import BalanceDetails from '../BalanceDetails';
import SelectTokenButton from '../SelectTokenButton';
import TabSelector from '../TabSelector';
import {Token} from '../../SendContainerV2'

const StyledContainer = styled.form`
    &&& {
        > button {
            &.light-blue {
                margin: 0 auto;
                display: block;
            }
        }

        .amount-input-wrapper {
            margin: 55px 0px 15px;
            height: 74px;
            display: flex;
            align-items: center;
        }

        .usd-amount {
            text-align: center;
            margin-bottom: 20px;
            color: #A2A2A8;
        }

        .select-token-btn {
            margin: 55px 0 5px 0;
        }
    }
`;

type EnterAmountProps = {
    amount: string;
    rawAmount: string;
    onChangeAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSetMaxAmount: () => void;
    availableToSend: string;
    continueAllowed: boolean;
    onContinue: (e: React.FormEvent) => void;
    onClickCancel: () => void;
    selectedToken: Token;
    onClickSelectToken: () => void;
    error: boolean;
    isMobile: boolean;
};

const EnterAmount = ({
    amount,
    rawAmount,
    onChangeAmount,
    onSetMaxAmount,
    availableToSend,
    continueAllowed,
    onContinue,
    onClickCancel,
    selectedToken,
    onClickSelectToken,
    error,
    isMobile
}: EnterAmountProps) => {
    return (
        <StyledContainer
            className='buttons-bottom'
            onSubmit={(e: React.FormEvent) => {onContinue(e); e.preventDefault()}}
            noValidate
        >
            <TabSelector/>
            <div className='amount-input-wrapper'>
                <AmountInput
                    value={amount}
                    onChange={onChangeAmount}
                    error={error}
                    autoFocus={!isMobile}
                />
            </div>
            {selectedToken.onChainFTMetadata?.symbol === 'NEAR' &&
                <div className='usd-amount'>
                    <Balance amount={rawAmount} showBalanceInNEAR={false}/>
                </div>
            }
            <FormButton
                onClick={onSetMaxAmount}
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
                selectedToken={selectedToken}
            />
            <div className='buttons-bottom-buttons'>
                {/* TODO: Add error state */}
                <FormButton
                    type='submit'
                    disabled={!continueAllowed}
                    data-test-id="sendMoneyPageSubmitAmountButton"
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
