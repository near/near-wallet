import BN from 'bn.js';
import React, { Component } from 'react';
import styled from 'styled-components';

import { parseTokenAmount, formatTokenAmount, removeTrailingZeros } from '../../utils/amounts';
import isDecimalString from '../../utils/isDecimalString';
import Container from '../common/styled/Container.css';
import EnterAmount from './components/views/EnterAmount';
import EnterReceiver from './components/views/EnterReceiver';
import Review from './components/views/Review';
import SelectToken from './components/views/SelectToken';

//TODO: Handle min-height when showing top banner
const StyledContainer = styled(Container)`
    &&& {
        .header {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #272729;
            font-weight: 600;
            font-size: 20px;
    
            .back-arrow-button {
                position: absolute;
                left: 0;
            }
        }

        .buttons-bottom-buttons {
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
        
                .buttons-bottom-buttons {
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
            parsedAmount: '',
            receiverId: '',
            view: 'enterAmount',
            maxAmount: null,
            sendingToken: false,
            selectedToken: {
                symbol: 'NEAR'
            }
        };
    }

    handleChangeAmount = (amount) => {
        // FIX: Add block when entering more than max decimals allowed
        this.setState({ 
            amount,
            parsedAmount: this.getParsedTokenAmount(amount),
            maxAmount: false
        });
    }

    getParsedTokenAmount = (amount) => {

        const {
            selectedToken,
        } = this.state;

        const {
            parseNearAmount
        } = this.props;

        const parsedTokenAmount = selectedToken.symbol === 'NEAR' ? 
            parseNearAmount(amount) 
            : 
            parseTokenAmount(amount, selectedToken.decimals);

        return parsedTokenAmount;

    }

    getFormattedTokenAmount = (amount) => {
        const {
            selectedToken
        } = this.state;

        const {
            availableNearToSend,
            formatNearAmount
        } = this.props;

        const formattedTokenAmount = selectedToken.symbol === 'NEAR' ? 
            formatNearAmount(availableNearToSend, 5) 
            : 
            removeTrailingZeros(formatTokenAmount(selectedToken.balance, selectedToken.decimals, 5));

        return formattedTokenAmount;
    }



    handleSetMaxAmount = () => {
        const {
            selectedToken
        } = this.state;

        const {
            availableNearToSend
        } = this.props;

        const maxAvailableToSend = selectedToken.symbol === 'NEAR' ? 
            availableNearToSend
            : 
            selectedToken.balance;

        if (!new BN(this.getFormattedTokenAmount(maxAvailableToSend)).isZero()) {
            this.setState({
                maxAmount: true,
                amount: this.getFormattedTokenAmount(maxAvailableToSend).replace(/,/g, ''),
                parsedAmount: maxAvailableToSend
            });
        }
    }

    isValidAmount = () => {
        const { amount, selectedToken, maxAmount } = this.state;
        const { availableNearToSend } = this.props;
        const parsedTokenAmount = this.getParsedTokenAmount(amount);
        const availableToSendBalance = selectedToken.symbol === 'NEAR' ? availableNearToSend : selectedToken.balance;

        if (maxAmount) {
            return true;
        }

        return !new BN(parsedTokenAmount).isZero() && new BN(parsedTokenAmount).lte(new BN(availableToSendBalance)) && isDecimalString(amount);
        // TODO: Handle rounding issue that can occur entering exact available amount
    }

    handleContinueToEnterReceiver = () => {
        this.setState({ view: 'enterReceiver' });
        //TODO: Add amount to URL?
    }

    handleSelectToken = (token) => {
        //TODO: Add token to URL?
        this.setState({ 
            selectedToken: token,
            view: 'enterAmount',
            amount: '',
            parsedAmount: '',
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

    handleChangeReciverId = (receiverId) => {
        this.setState({ receiverId });
    }

    handleSendToken = () => {
        console.log('TODO: Send token!');
    }

    render() {

        const {
            amount,
            parsedAmount,
            view,
            selectedToken,
            receiverId,
            sendingToken
        } = this.state;

        const {
            availableNearBalance,
            reservedNearForFees,
            availableNearToSend,
            redirectTo,
            fungibleTokens,
            nearTokenData,
            checkAccountAvailable,
            localAlert,
            clearLocalAlert,
            accountId,
            sendTokenTxFeeAmount,
            parseNearAmount
        } = this.props;

        // TODO: Add NEAR token data to selectedToken object instead
        const availableToSend = selectedToken.symbol === 'NEAR' ? nearTokenData.balance : selectedToken.balance;
        const estimatedFeesInNear = parseNearAmount(sendTokenTxFeeAmount);
        const estimatedTotalInNear = selectedToken.symbol === 'NEAR' ? new BN(parsedAmount).add(new BN(estimatedFeesInNear)).toString() : null;

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
                        onContinue={this.handleContinueToEnterReceiver}
                        onClickCancel={() => redirectTo('/')}
                        selectedToken={selectedToken}
                        onClickSelectToken={() => this.setState({ view: 'selectToken' })}
                        error={amount && amount !== '0' && !this.enterAmountIsComplete()}
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
                {view === 'enterReceiver' &&
                    <EnterReceiver
                        onClickGoBack={() => this.setState({ view: 'enterAmount' })}
                        onClickCancel={() => redirectTo('/')}
                        amount={parsedAmount}
                        selectedToken={selectedToken}
                        handleChangeReciverId={this.handleChangeReciverId}
                        receiverId={receiverId}
                        checkAccountAvailable={checkAccountAvailable}
                        localAlert={localAlert}
                        clearLocalAlert={clearLocalAlert}
                        onClickContinue={() => this.setState({ view: 'review' })}
                    />
                }
                {view === 'review' &&
                    <Review
                        onClickCancel={() => redirectTo('/')}
                        amount={parsedAmount}
                        selectedToken={selectedToken}
                        onClickContinue={this.handleSendToken}
                        senderId={accountId}
                        receiverId={receiverId}
                        estimatedFeesInNear={estimatedFeesInNear}
                        estimatedTotalInNear={estimatedTotalInNear}
                        sendingToken={sendingToken}
                    />
                }
            </StyledContainer>
        );
    }
}

export default SendContainerV2;