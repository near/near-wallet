import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Balance from '../../common/balance/Balance';

const Container = styled.div`
    input {
        color: ${(props) => props.status === '#ff585d' ? props.status : '#24272A'} !important;
    }

    .available-balance {
        cursor: pointer;
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        color: ${(props) => props.status === '#ff585d' ? props.status : ''};

        .balance {
            text-align: right;
        }
    }
`;

export default function AmountInput({
    value, onChange, valid, disabled, insufficientBalance,
    availableBalance, availableClick = null, action, stakeFromAccount, inputTestId
}) {
    let validationStatus;
    if (valid) {
        validationStatus = '#6AD1E3';
    } else if (insufficientBalance) {
        validationStatus = '#ff585d';
    }

    return (
        <Container status={validationStatus} hasValue={value.length}>
            <input 
                disabled={disabled}
                type='number' 
                autoFocus
                placeholder='0'
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className='stake-amount-input'
                data-test-id={inputTestId}
            />
            <div className='available-balance' onClick={availableClick}>
                <Translate id={`staking.${action}.input.availableBalance`} /><Balance amount={availableBalance} showBalanceInUSD={false}/>
            </div>
        </Container>
    );
}
