import React from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
    text-align: center;
    font-weight: 600;
    padding: 0;
    height: 73px;
    border: 0;

    :focus {
        border: 0;
        box-shadow: none;
    }

    ::placeholder {
        color: #CCCCCC;
    }

    &.error {
        color: #FC5B5B;
    }
`

const getFontSize = (charLength) => {
    const baseSize = 60
    if (charLength >= baseSize) {
        charLength = baseSize - 5
    }
    const fontSize = baseSize - charLength
    return fontSize
}

const AmountInput = ({ value, onChange, error }) => {
    return (
        <StyledInput
            className={error ? 'error' : ''}
            style={{ fontSize: `${value.length > 8 ? getFontSize(value.length) : 60}px` }}
            type='number'
            placeholder='0'
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    )
}

export default AmountInput 