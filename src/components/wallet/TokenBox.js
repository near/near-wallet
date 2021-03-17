import React from 'react'
import styled from 'styled-components'
import DefaultTokenIcon from '../svg/DefaultTokenIcon'

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
        width: 24px;
        height: 24px;
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
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;

                @media (max-width: 500px) {
                    max-width: 150px;
                }
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
            <div className='symbol'>
                {token.icon ? token.icon : <DefaultTokenIcon/>}
            </div>
            <div className='desc'>
                <span>{token.symbol}</span>
                <span title={token.contract}>{token.contract}</span>
            </div>
            <div className='balance'>{token.balance}</div>
        </StyledContainer>
    )
}

export default TokenBox
