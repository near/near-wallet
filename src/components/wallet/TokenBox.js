import React from 'react'
import styled from 'styled-components'
import DefaultTokenIcon from '../svg/DefaultTokenIcon'
import { EXPLORER_URL } from '../../utils/wallet'
import TokenAmount from './TokenAmount'
import isDataURL from '../../utils/isDataURL'

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 14px;

    @media (max-width: 767px) {
        margin: 0 -14px;
    }

    @media (min-width: 992px) {
        padding: 15px 20px;
    }

    .symbol {
        width: 33px;
        height: 33px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        img, svg {
            height: 32px;
            width: 32px;
        }
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

        .dots {
            :after {
                position: absolute;
                content: '.';
                font-weight: 300;
                animation: link 1s steps(5, end) infinite;
            
                @keyframes link {
                    0%, 20% {
                        color: rgba(0,0,0,0);
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    40% {
                        color: #24272a;
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    60% {
                        text-shadow:
                            .3em 0 0 #24272a,
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    80%, 100% {
                        text-shadow:
                            .3em 0 0 #24272a,
                            .6em 0 0 #24272a;
                    }
                }
            }
        }
    }
`

const TokenBox = ({ token }) => {
    return (
        <StyledContainer className='token-box'>
            <div className='symbol'>
                {token.icon && isDataURL(token.icon) ?
                    <img src={token.icon} alt={token.name}/>
                    :
                    <DefaultTokenIcon/>
                }
            </div>
            <div className='desc'>
                <span>{token.symbol}</span>
                <span title={token.contractName}>
                    <a href={`${EXPLORER_URL}/accounts/${token.contractName}`} target='_blank' rel='noopener noreferrer'>
                        {token.contractName}
                    </a>
                </span>
            </div>
            <TokenAmount 
                token={token} 
                className='balance'
            />
        </StyledContainer>
    )
}

export default TokenBox
