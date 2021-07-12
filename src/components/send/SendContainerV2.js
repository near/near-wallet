import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Container from '../common/styled/Container.css';
import EnterAmount from './components/views/EnterAmount';

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
//TODO: Handle min-height when showing top banner


class SendContainerV2 extends Component {

    state = {
        amount: '',
        view: 'enterAmount'
    }

    handleSetMaxAmaount = () => {
        console.log('set max amount');
    }

    render() {

        const { amount, view } = this.state;

        return (
            <StyledContainer className='small-centered'>
                {view === 'enterAmount' &&
                    <EnterAmount
                        amount={amount}
                        onChangeAmount={amount => this.setState({ amount })}
                        onSetMaxAmaount={this.handleSetMaxAmaount}
                        availableToSend='200000000000000000000'
                        availableBalance='500000000000000000000'
                        reservedForFees='9900000000000000000000'
                    />
                }
            </StyledContainer>
        );
    }
}

const mapStateToProps = ({ account }) => ({
   account,
   accountId: account.accountId,
   availableBalance: account.balance?.available
});

export const SendContainerV2WithRouter = connect(
   mapStateToProps
)(withRouter(SendContainerV2));