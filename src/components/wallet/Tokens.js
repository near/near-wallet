import React from 'react'
import styled from 'styled-components'
import TokenBox from './TokenBox'

const StyledContainer = styled.div`
    width: 100%;

    .token-box {
        border-top: 1px solid #F0F0F1;

        :last-of-type {
            border-bottom: 1px solid #F0F0F1;
        }
    }
`

const Tokens = ({ tokens }) => {
    return (
        <StyledContainer>
            {tokens.map((token, i) => (
                <TokenBox key={i} token={token}/>
            ))}
        </StyledContainer>
    )
}

export default Tokens