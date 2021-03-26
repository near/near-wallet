import React from 'react'
import styled from 'styled-components'
import DefaultTokenIcon from '../svg/DefaultTokenIcon'
import { EXPLORER_URL } from '../../utils/wallet'

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 14px;

    @media (max-width: 767px) {
        margin: 0 -14px;
    }

    @media (min-width: 992px) {
        margin: 0 -20px;
    }

    .symbol {
        width: 32px;
        height: 32px;
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
                max-width: 350px;
                overflow: hidden;
                text-overflow: ellipsis;

                @media (max-width: 991px) {
                    max-width: 250px;
                }

                @media (max-width: 500px) {
                    max-width: 180px;
                }

                @media (max-width: 330px) {
                    max-width: 150px;
                }

                a {
                    color: inherit;
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
                <DefaultTokenIcon/>
            </div>
            <div className='desc'>
                <span>{token.symbol}</span>
                <span title={token.contract}>
                    <a href={`${EXPLORER_URL}/accounts/${token.contract}`} target='_blank' rel='noopener noreferrer'>
                        {token.contract}
                    </a>
                </span>
            </div>
            <div className='balance'>{token.balance}</div>
        </StyledContainer>
    )
}

export default TokenBox
