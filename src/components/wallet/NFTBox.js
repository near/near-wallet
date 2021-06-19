import React from 'react'
import styled from 'styled-components'
import DefaultTokenIcon from '../svg/DefaultTokenIcon'
import { EXPLORER_URL } from '../../utils/wallet'
import isDataURL from '../../utils/isDataURL'
import FailedToLoad from '../../images/failed_to_load.svg'

const StyledContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    padding: 15px 14px;

    :first-of-type {
        padding: 0 14px 15px 14px;
    }

    @media (max-width: 767px) {
        margin: 0 -14px;
    }

    @media (min-width: 992px) {
        padding: 15px 20px;

        :first-of-type {
            padding: 0 20px 15px 20px;
        }
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
        align-items: center;
        margin-left: 14px;

        a {
            font-weight: 700;
            font-size: 16px;
            color: #24272a;
        }

        span {
            color: #72727A;
            background-color: #F0F0F1;
            font-size: 14px;
            font-weight: 600;
            min-width: 26px;
            min-height: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 10px;
        }
    }

    .tokens {
        display: flex;
        flex-wrap: wrap;
        max-width: 100%;
    }

    .nft {
        flex-grow: 1;
        flex-basis: 50%;
        max-width: 50%;
        padding: 15px 0;
        color: black;

        :nth-child(odd) {
            padding-right: 5px;
        }

        :nth-child(even) {
            padding-left: 5px;
        }
    }

    .nft img {
        width: 100%;
        margin-bottom: 10px;
    }
`

const NFTBox = ({ token }) => {
    return (
        <StyledContainer className='nft-box'>
            <div className='nft-header'>
                <div className='symbol'>
                    {token.icon && isDataURL(token.icon) ?
                        <img src={token.icon} alt={token.name}/>
                        :
                        <DefaultTokenIcon/>
                    }
                </div>
                <div className='desc'>
                    <a href={`${EXPLORER_URL}/accounts/${token.contractName}`} title={token.name} target='_blank' rel='noopener noreferrer'>
                        {token.name}
                    </a>
                    <span>{token.tokens?.length}</span>
                </div>
            </div>
            {
                token.tokens &&
                <div className='tokens'>
                    {token.tokens.map(token => <div className='nft' key={token.token_id}>
                        <img src={token.metadata.mediaUrl} alt='NFT' onError={(e)=>{e.target.onerror = null; e.target.src = FailedToLoad}}/>
                        <b>{token.metadata.title}</b>
                    </div>)}
                </div>
            }
        </StyledContainer>
    )
}

export default NFTBox
