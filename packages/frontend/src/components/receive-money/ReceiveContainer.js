import React from 'react';
import styled from 'styled-components';

import AccountId from './components/AccountId';
import AccountIdQRCode from './components/AccountIdQRCode';
import AvailableBalance from './components/AvailableBalance';
import Container from '../common/styled/Container.css';
import TabSelector from '../send/components/TabSelector';

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


const ReceiveContainer = ({
    accountId,
    availableBalance
}) => {
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
};

export default ReceiveContainer;
