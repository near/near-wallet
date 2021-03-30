import React from 'react'
import styled from 'styled-components'
import TokenBox from './TokenBox'

const StyledContainer = styled.div`
    width: 100%;

    @media (max-width: 991px) {
        margin-bottom: 50px;
    }

    .token-box {
        border-top: 1px solid #F0F0F1;

        :last-of-type {
            border-bottom: 1px solid #F0F0F1;

            @media (min-width: 992px) {
                margin-bottom: -20px;
                border-bottom: 0;
            }
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