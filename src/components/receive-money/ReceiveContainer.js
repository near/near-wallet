import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Container from '../common/styled/Container.css';
import TabSelector from '../send/components/TabSelector';
import AccountId from './components/AccountId';
import AccountIdQRCode from './components/AccountIdQRCode';
import AvailableBalance from './components/AvailableBalance';

const StyledContainer = styled(Container)`
    > div {
        :nth-of-type(2) {
            margin: 70px auto;
        }

        :nth-of-type(4) {
            margin-top: 5px;
        }
    }
`;


class ReceiveContainer extends Component {
    render() {

        const { accountId, availableBalance } = this.props;

        return (
            <StyledContainer className='small-centered'>
                <TabSelector/>
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