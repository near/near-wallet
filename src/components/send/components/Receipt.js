import React from 'react'
import styled from 'styled-components'
import Status from './entry_types/Status'
import Token from './entry_types/Token'
import Amount from './entry_types/Amount'
import Receiver from './entry_types/Receiver'
import DateAndTime from './entry_types/DateAndTime'

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
`

const Receipt = ({ 
    receipt = {
        status: 'SuccessValue',
        token: {
            symbol: 'NEAR',
            amount: '50000000000000000000000000000',
            decimals: 24,
            icon: ''
        },
        network_fees: '200000000000000000000',
        receiver_id: 'corwin.near',
        block_timestamp: 1624648200755
    }
}) => {

    const translate = (type) => `sendV2.TXEntry.title.${type}`;
    
    return (
        <StyledContainer>
            <Status
                translate={translate('status')}
                status={receipt.status}
            />
            <Token
                translate={translate('token')}
                symbol={receipt.token.symbol}
                icon={receipt.token.icon}
            />
            <Amount
                translate={translate('amount')}
                symbol={receipt.token.symbol}
                amount={receipt.token.amount}
                decimals={receipt.token.decimals}
            />
            <Amount
                translate={translate('networkFees')}
                amount={receipt.network_fees}
            />
            <Receiver
                translate={translate('receiverId')}
                receiverId={receipt.receiver_id}
            />
            <DateAndTime
                translate={translate('timeStamp')}
                timeStamp={receipt.block_timestamp}
            />
        </StyledContainer>
    )
}

export default Receipt