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

const prefixTXEntryTitleId = (key) => `sendV2.TXEntry.title.${key}`;

const Receipt = ({ status, token, network_fees, receiver_id, block_timestamp }) => {
    
    return (
        <StyledContainer>
            <Status
                translateIdTitle={prefixTXEntryTitleId('status')}
                status={status}
            />
            <Token
                translateIdTitle={prefixTXEntryTitleId('token')}
                symbol={token.symbol}
                icon={token.icon}
            />
            <Amount
                translateIdTitle={prefixTXEntryTitleId('amount')}
                symbol={token.symbol}
                amount={token.amount}
                decimals={token.decimals}
            />
            <Amount
                translateIdTitle={prefixTXEntryTitleId('networkFees')}
                amount={network_fees}
            />
            <Receiver
                translateIdTitle={prefixTXEntryTitleId('receiverId')}
                receiverId={receiver_id}
            />
            <DateAndTime
                translateIdTitle={prefixTXEntryTitleId('timeStamp')}
                timeStamp={block_timestamp}
            />
        </StyledContainer>
    );
};

export default Receipt;