import React from 'react';
import styled from 'styled-components';

import Amount from './entry_types/Amount';
import DateAndTime from './entry_types/DateAndTime';
import Receiver from './entry_types/Receiver';
import Status from './entry_types/Status';
import Token from './entry_types/Token';

const StyledContainer = styled.div`
    background-color: #FAFAFA;
    border: 1px solid #F0F0F1;
    border-radius: 8px;

    > div {
        border-bottom: 1px solid #F0F0F1;

        :last-of-type {
            border-bottom: 0;
        }
    }
`;

const translate = (type) => `sendV2.TXEntry.title.${type}`;

const Receipt = ({ status, token, network_fees, receiver_id, block_timestamp }) => {
    
    return (
        <StyledContainer>
            <Status
                translate={translate('status')}
                status={status}
            />
            <Token
                translate={translate('token')}
                symbol={token.symbol}
                icon={token.icon}
            />
            <Amount
                translate={translate('amount')}
                symbol={token.symbol}
                amount={token.amount}
                decimals={token.decimals}
            />
            <Amount
                translate={translate('networkFees')}
                amount={network_fees}
            />
            <Receiver
                translate={translate('receiverId')}
                receiverId={receiver_id}
            />
            <DateAndTime
                translate={translate('timeStamp')}
                timeStamp={block_timestamp}
            />
        </StyledContainer>
    );
};

export default Receipt;