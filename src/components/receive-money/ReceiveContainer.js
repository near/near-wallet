import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Container from '../common/styled/Container.css';
import AccountId from './components/AccountId';
import AccountIdQRCode from './components/AccountIdQRCode';
import AvailableBalance from './components/AvailableBalance';

const StyledContainer = styled(Container)`
    > div {
        :nth-of-type(1) {
            margin-top: 60px;
        }

        :nth-of-type(2) {
            margin-top: 50px;
        }

        :nth-of-type(3) {
            margin-top: 5px;
        }
    }
`;


class ReceiveContainer extends Component {
    render() {

        const { accountId, availableBalance } = this.props;

        return (
            <StyledContainer className='small-centered'>
                <AccountIdQRCode
                    accountId={accountId}
                />
                <AccountId
                    accountId={accountId}
                />
                <AvailableBalance
                    availableBalance={availableBalance}
                />
            </StyledContainer>
        );
    }
}

const mapStateToProps = ({ account }) => ({
   account,
   accountId: account.accountId,
   availableBalance: account.balance?.available
});

export const ReceiveContainerWithRouter = connect(
   mapStateToProps
)(withRouter(ReceiveContainer));