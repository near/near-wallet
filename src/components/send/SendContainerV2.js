import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Container from '../common/styled/Container.css';
import EnterAmount from './components/views/EnterAmount';

const StyledContainer = styled(Container)`

`;


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