import React from 'react'
import styled from 'styled-components'

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;

    @media (max-width: 767px) {
        padding: 15px 14px;
        margin: 0 -14px 0 -14px;
    }

    .symbol {
        width: 40px;
        height: 40px;
        background-color: #f5f5f5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .desc {
        display: flex;
        flex-direction: column;
        margin-left: 14px;

        span {
            :first-of-type {
                font-weight: 700;
                font-size: 16px;
                color: #24272a;
            }
            :last-of-type {
                font-size: 12px;
                color: #72727A;
            }
        }
    }

    .balance {
        margin-left: auto;
        font-size: 16px;
        font-weight: 700;
        color: #24272a;
    }
`

const TokenBox = ({ token }) => {
    return (
        <StyledContainer className='token-box'>
            <div className='symbol'>{/* TODO: Icon */}</div>
            <div className='desc'>
                <span>{token.symbol}</span>
                <span>{token.contract}</span>
            </div>
            <div className='balance'>{token.balance}</div>
        </StyledContainer>
    )
}

export default TokenBox
