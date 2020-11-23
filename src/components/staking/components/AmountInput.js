import React from 'react'
import styled from 'styled-components'
import Balance from '../../common/Balance'
import { Translate } from 'react-localize-redux'
import BalanceBreakdown from './BalanceBreakdown'

const Container = styled.div`

    .input-wrapper {
        display: flex;
        align-items: center;
        color: #24272A;
        font-size: 34px;
        color: #CCCCCC;
        border-color: ${props => props.status ? props.status : ''};
    }

    input {
        background: none !important;
        border: 2px solid #E4E4E6 !important;
        font-size: 38px !important;
        margin: 0 !important;
        font-weight: 600 !important;
        color: #24272A !important;
        height: 62px !important;
        color: ${props => props.status === '#ff585d' ? props.status : '#24272A'} !important;

        ::placeholder {
            color: #CCCCCC;
            opacity: 1;
        }
    }

    .available-balance {
        cursor: pointer;
        margin-top: 10px;
        font-size: 13px;
        line-height: normal;
        color: ${props => props.status === '#ff585d' ? props.status : ''};
    }
`

export default function AmountInput({
    value, onChange, valid, loading, insufficientBalance,
    availableBalance, availableClick = null, action
}) {
    let validationStatus
    if (valid) {
        validationStatus = '#6AD1E3'
    } else if (insufficientBalance) {
        validationStatus = '#ff585d'
    }

    return (
        <Container status={validationStatus} hasValue={value.length}>
            <div className='input-wrapper'>
                <input 
                    disabled={loading} 
                    type='number' 
                    autoFocus 
                    placeholder='0' 
                    value={value} 
                    onChange={e => onChange(e.target.value)}
                />
            </div>
            {/* <div className='available-balance' onClick={availableClick}>
                <Translate id={`staking.${action}.input.availableBalance`} />&nbsp;<Balance amount={availableBalance} symbol='near'/>
            </div> */}
            <BalanceBreakdown/>
        </Container>
    )
}