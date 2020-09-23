import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 2px solid #CCCCCC;
    color: #24272A;
    font-size: 34px;
    color: #CCCCCC;

    span {
        margin-right: 15px;
        font-weight: 500 !important;
        margin-top: -8px;
    }

    input {
        background: none !important;
        border: 0 !important;
        font-size: 40px !important;
        padding: 0 !important;
        margin: 0 !important;
        font-weight: 500 !important;
        color: #24272A !important;
        font-family: BwSeidoRound !important;

        ::placeholder {
            color: #CCCCCC;
            opacity: 1;
        }
    }
`

export default function AmountInput({ value, onChange }) {
    return (
        <Container>
            <span>Ⓝ</span>
            <input type='number' placeholder='0' value={value} onChange={e => onChange(e.target.value)}/>
        </Container>
    )
}