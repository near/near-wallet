import BN from 'bn.js';
import React, { Component } from 'react';
import styled from 'styled-components';

import { parseTokenAmount, formatTokenAmount, removeTrailingZeros } from '../../utils/amounts';
import isDecimalString from '../../utils/isDecimalString';
import Container from '../common/styled/Container.css';
import EnterAmount from './components/views/EnterAmount';
import SelectToken from './components/views/SelectToken';

//TODO: Handle min-height when showing top banner
const StyledContainer = styled(Container)`
    &&& {
        .main-buttons-container {
            margin-top: 55px;
    
            > button {
                display: block;
                width: 100%;
            }
    
            .link {
                display: block;
                margin: 20px auto;
            }
        }
    
        @media (max-width: 500px) {
            .buttons-bottom {
                display: flex;
                flex-direction: column;
        
                .main-buttons-container {
                    margin-top: auto;
                }
        
                &.enter-amount {
                    min-height: calc(100vh - 110px);
                }
            }
        }
    }
`;

class SendContainerV2 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            amount: '',
            view: 'enterAmount',
            maxAmount: null,
            selectedToken: {
                symbol: 'NEAR'
            }
        };
    }

    handleChangeAmount = (amount) => {
        // FIX: Add block when entering more than max decimals allowed
        this.setState({ amount, maxAmount: false });
    }

    handleSetMaxAmount = () => {
        const {
            selectedToken
        } = this.state;

        const {
            availableNearToSend,
            formatNearAmount
        } = this.props;

        const availableToSend = selectedToken.symbol === 'NEAR' ? 
            formatNearAmount(availableNearToSend, 5) 
            : 
            removeTrailingZeros(formatTokenAmount(selectedToken.balance, selectedToken.decimals, 5));

        if (!new BN(availableToSend).isZero()) {
            this.setState({
                maxAmount: true,
                amount: availableToSend.replace(/,/g, '')
            });
        }
    }

    isValidAmount = () => {
        const { amount, selectedToken, maxAmount } = this.state;
        const { availableNearToSend, parseNearAmount } = this.props;

        if (maxAmount) {
            return true;
        }

        if (selectedToken.symbol === 'NEAR') {
            const parsedNearAmount = parseNearAmount(amount);
            return !new BN(parsedNearAmount).isZero() && new BN(parsedNearAmount).lte(new BN(availableNearToSend)) && isDecimalString(amount);
        } else {
            const parsedTokenAmount = parseTokenAmount(amount, selectedToken.decimals);
            return !new BN(parsedTokenAmount).isZero() && new BN(parsedTokenAmount).lte(new BN(selectedToken.balance)) && isDecimalString(amount);
            // TODO: Handle rounding issue that can occur entering exact available amount
        }
    }

    handleContinueToEnterRecipient = () => {
        console.log('TODO: continue to Recipient');
        //TODO: Add amount to URL?
    }

    handleSelectToken = (token) => {
        //TODO: Add token to URL?
        this.setState({ 
            selectedToken: token,
            view: 'enterAmount',
            amount: '',
            maxAmount: false
        });
    }

    enterAmountIsComplete = () => {
        const { selectedToken, amount } = this.state;
        const { availableNearToSend } = this.props;
        
        const availableAmount = selectedToken.symbol === 'NEAR' ? 
            availableNearToSend 
            : 
            selectedToken.balance;

        return amount && !new BN(availableAmount).isZero() && this.isValidAmount();
    }

    render() {

        const {
            amount,
            view,
            selectedToken
        } = this.state;

        const {
            availableNearBalance,
            reservedNearForFees,
            availableNearToSend,
            redirectTo,
            fungibleTokens,
            nearTokenData
        } = this.props;

        // TODO: Add NEAR token data to selectedToken object instead
        const availableToSend = selectedToken.symbol === 'NEAR' ? nearTokenData.balance : selectedToken.balance;
        const enterAmountError = amount && amount !== '0' && !this.enterAmountIsComplete();

        return (
            <StyledContainer className='small-centered'>
                {view === 'enterAmount' &&
                    <EnterAmount
                        amount={amount}
                        onChangeAmount={this.handleChangeAmount}
                        onSetMaxAmaount={this.handleSetMaxAmount}
                        availableToSend={availableToSend}
                        availableBalance={availableNearBalance}
                        reservedForFees={reservedNearForFees}
                        continueAllowed={this.enterAmountIsComplete()}
                        onContinue={this.handleContinueToEnterRecipient}
                        onGoBack={() => redirectTo('/')}
                        selectedToken={selectedToken}
                        onClickSelectToken={() => this.setState({ view: 'selectToken' })}
                        error={enterAmountError}
                    />
                }
                {view === 'selectToken' &&
                    <SelectToken
                        onClickGoBack={() => this.setState({ view: 'enterAmount' })}
                        onSelectToken={this.handleSelectToken}
                        fungibleTokens={fungibleTokens}
                        availableNearToSend={availableNearToSend}
                    />
                }
            </StyledContainer>
        );
    }
}

export default SendContainerV2;