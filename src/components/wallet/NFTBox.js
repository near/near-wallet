import React from 'react'
import styled from 'styled-components'
import DefaultTokenIcon from '../svg/DefaultTokenIcon'
import { EXPLORER_URL } from '../../utils/wallet'
import isDataURL from '../../utils/isDataURL'

const StyledContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    padding: 15px 14px;

    @media (max-width: 767px) {
        margin: 0 -14px;
    }

    @media (min-width: 992px) {
        margin: 0 -20px;
        padding: 15px 20px;
    }

    .nft-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
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

    .tokens {
        display: flex;
        flex-wrap: wrap;
        margin-right: -15px;
    }

    .nft {
        flex-grow: 1;
        flex-basis: 50%;
        max-width: 50%;
        padding: 15px 0;
        padding-right: 15px;
    }

    .nft img {
        width: 100%;
    }
`

const NFTBox = ({ token }) => {
    return (
        <StyledContainer className='token-box'>
            <div className='nft-header'>
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
            </div>
            {
                token.tokens &&
                <div className='tokens'>
                    {token.tokens.map(token => <div className='nft' key={token.token_id}>
                        <img src={token.metadata.mediaUrl}/>
                        <b>{token.metadata.title}</b>
                    </div>)}
                </div>
            }
        </StyledContainer>
    )
}

export default NFTBox
