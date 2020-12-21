import React from 'react'
import styled from 'styled-components'
import Balance from '../../common/Balance'
import { Translate } from 'react-localize-redux'
import BalanceBreakdown from './BalanceBreakdown'

const Container = styled.div`
    input {
        color: ${props => props.status === '#ff585d' ? props.status : '#24272A'} !important;
    }

    .available-balance {
        cursor: pointer;
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        color: ${props => props.status === '#ff585d' ? props.status : ''};
    }
`

export default function AmountInput({
    value, onChange, valid, loading, insufficientBalance,
    availableBalance, availableClick = null, action, stakeFromAccount
}) {
    let validationStatus
    if (valid) {
        validationStatus = '#6AD1E3'
    } else if (insufficientBalance) {
        validationStatus = '#ff585d'
    }

    return (
        <Container status={validationStatus} hasValue={value.length}>
            <input 
                disabled={loading}
                type='number' 
                autoFocus
                placeholder='0'
                value={value}
                onChange={e => onChange(e.target.value)}
                className='amount-input'
            />
            {(action === 'unstake' || !stakeFromAccount) ? (
                <div className='available-balance' onClick={availableClick}>
                    <Translate id={`staking.${action}.input.availableBalance`} /><Balance amount={availableBalance} symbol='near'/>
                </div>
            ) : (
                <BalanceBreakdown
                    total={availableBalance}
                    onClickAvailable={availableClick}
                    availableType={`staking.${action}.input.availableBalance`}
                    error={insufficientBalance}
                />
            )}
        </Container>
    )
}