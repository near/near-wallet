import BN from 'bn.js';
import { utils } from 'near-api-js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import {
    redirectTo
} from '../../actions/account';
import isDecimalString from '../../utils/isDecimalString';
import { WALLET_APP_MIN_AMOUNT } from '../../utils/wallet';
import Container from '../common/styled/Container.css';
import EnterAmount from './components/views/EnterAmount';

const { parseNearAmount, formatNearAmount } = utils.format;

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

const getAvailableNearToSend = (availableBalance, reservedForFees) => {
    const availableToSendBN = new BN(availableBalance).sub(new BN(reservedForFees));
    return availableToSendBN.isNeg() ? '0' : availableToSendBN.toString();
};
class SendContainerV2 extends Component {

    state = {
        amount: '',
        view: 'enterAmount',
        maxAmount: null,
        selectedToken: {
            symbol: 'NEAR',
            icon: null
        }
    }

    handleChangeAmount = (amount) => {
        this.setState({ amount, maxAmount: false });
    }

    handleSetMaxNearAmount = () => {
        const {
            availableNearToSend
        } = this.props;

        if (!new BN(availableNearToSend).isZero()) {
            this.setState({
                maxAmount: true,
                amount: formatNearAmount(availableNearToSend, 5).replace(/,/g, '')
            });
        }
    }

    isValidNearAmount = () => {
        const { maxAmount, amount } = this.state;
        const { availableNearToSend } = this.props;

        if (amount === '0') {
            return false;
        }

        if (maxAmount) {
            return true;
        }

        return !new BN(parseNearAmount(amount)).gt(new BN(availableNearToSend)) && isDecimalString(amount);
    }

    handleContinueToEnterRecipient = () => {
        console.log('TODO: continue to Recipient');
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
            redirectTo
        } = this.props;

        const continueToEnterRecipientAllowed = amount && !new BN(availableNearToSend).isZero() && this.isValidNearAmount();

        return (
            <StyledContainer className='small-centered'>
                {view === 'enterAmount' &&
                    <EnterAmount
                        amount={amount}
                        onChangeAmount={this.handleChangeAmount}
                        onSetMaxAmaount={this.handleSetMaxNearAmount}
                        availableToSend={getAvailableNearToSend(availableNearBalance, reservedNearForFees)}
                        availableBalance={availableNearBalance}
                        reservedForFees={reservedNearForFees}
                        continueAllowed={continueToEnterRecipientAllowed}
                        onContinue={this.handleContinueToEnterRecipient}
                        onGoBack={() => redirectTo('/')}
                        selectedToken={selectedToken}
                    />
                }
            </StyledContainer>
        );
    }
}

const mapDispatchToProps = {
    redirectTo
};

const mapStateToProps = ({ account }) => ({
    account,
    availableNearBalance: account.balance?.available,
    reservedNearForFees: parseNearAmount(WALLET_APP_MIN_AMOUNT),
    availableNearToSend: getAvailableNearToSend(account.balance?.available, parseNearAmount(WALLET_APP_MIN_AMOUNT))
});

export const SendContainerV2WithRouter = connect(mapStateToProps, mapDispatchToProps)(withRouter(SendContainerV2));