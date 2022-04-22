import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Balance from '../../../common/balance/Balance';
import FormButton from '../../../common/FormButton';
import ReceiverInfo from '../../../DonateToUkraine/ReceiverInfo';
import TooltipDonateInfo from '../../../DonateToUkraine/TooltipDonateInfo';
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

        .amount-input-wrapper {
            margin: 55px 0px 15px;
            height: 74px;
            display: flex;
            align-items: center;
        }

        .donate_title {
            text-align: center;
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
    isMobile,
    donateToUkraine = false,
    sendingToken = false
}) => {

    return (
        <StyledContainer 
            className='buttons-bottom'
            onSubmit={(e) => {onContinue(e); e.preventDefault();}}
            novalidate
        >
            {donateToUkraine 
                ?   <>
                    <h1 className='donate_title'>
                       <Translate id='link.donateToUkraine'/>
                    </h1>
                    <TooltipDonateInfo/>
                    </>
                : <TabSelector/> 
            }
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
            {donateToUkraine && <ReceiverInfo/>}
            <div className='buttons-bottom-buttons'>
                {/* TODO: Add error state */}
                <FormButton
                    type='submit'
                    disabled={!continueAllowed || sendingToken === true}
                    sending={donateToUkraine && sendingToken === true}
                    data-test-id="sendMoneyPageSubmitAmountButton"
                >
                   {!sendingToken && !donateToUkraine ? <Translate id='button.continue'/> : <Translate id={`button.${sendingToken === 'failed' ? 'retry' : 'donate'}`}/>}  
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
