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
        this.setState({ amount, maxAmount: false });
    }

    handleSetMaxNearAmount = () => {
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

    isValidNearAmount = () => {
        const { maxAmount, amount } = this.state;
        const { availableNearToSend, parseNearAmount } = this.props;

        if (amount === '0') {
            return false;
        }

        if (maxAmount) {
            return true;
        }

        return !new BN(parseNearAmount(amount)).gt(new BN(availableNearToSend)) && isDecimalString(amount);
    }

    isValidTokenAmount = () => {
        const { amount, selectedToken, maxAmount } = this.state;

        if (amount === '0') {
            return false;
        }

        if (maxAmount) {
            return true;
        }

        const parsedTokenAmount = amount ? parseTokenAmount(amount, selectedToken.decimals) : undefined;

        // TODO: Handle rounding issue when entering exact available amount
        return !new BN(parsedTokenAmount).gt(new BN(selectedToken.balance)) && isDecimalString(amount);
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
            amount: '0',
            maxAmount: false
        });
    }

    continueIsAllowed = () => {
        const { selectedToken, amount } = this.state;
        const { availableNearToSend } = this.props;

        if (selectedToken === 'NEAR') {
            return amount && !new BN(availableNearToSend).isZero() && this.isValidNearAmount();
        } else {
            return amount && !new BN(selectedToken.balance).isZero() && this.isValidTokenAmount();
        }
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

        const availableToSend = selectedToken.symbol === 'NEAR' ? nearTokenData.balance : selectedToken.balance;
        // TODO: Add NEAR token data to selectedToken object instead

        return (
            <StyledContainer className='small-centered'>
                {view === 'enterAmount' &&
                    <EnterAmount
                        amount={amount}
                        onChangeAmount={this.handleChangeAmount}
                        onSetMaxAmaount={this.handleSetMaxNearAmount}
                        availableToSend={availableToSend}
                        availableBalance={availableNearBalance}
                        reservedForFees={reservedNearForFees}
                        continueAllowed={this.continueIsAllowed()}
                        onContinue={this.handleContinueToEnterRecipient}
                        onGoBack={() => redirectTo('/')}
                        selectedToken={selectedToken}
                        onClickSelectToken={() => this.setState({ view: 'selectToken' })}
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