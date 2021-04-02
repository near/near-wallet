import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import Container from '../common/styled/Container.css'
import { Translate } from 'react-localize-redux'
import FormButton from '../common/FormButton'
import ArrowIcon from '../svg/ArrowIcon'
import MoonPayIcon from '../svg/MoonPayIcon'
import BinanceLogo from '../../images/binance-logo.svg'
import HuobiLogo from '../../images/huobi-logo.svg'
import OkexLogo from '../../images/okex-logo.svg'

const StyledContainer = styled(Container)`
    position: relative;

    button {
        display: block !important;

        svg {
            width: initial !important;
            height: initial !important;
            margin: initial !important;
        }

        &.go-back {
            position: absolute;

            svg {
                margin-top: -2px !important;
            }
        }

        &.learn-more {
            font-size: 14px !important;
            font-weight: 400 !important;
            text-decoration: none !important;
            margin-top: 10px !important;

            :hover {
                text-decoration: underline !important;
            }
        }

        &.black {
            width: 100% !important;
            height: 54px !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
            border-radius: 8px !important;
            border: 0 !important;

            svg {
                margin-left: 10px !important;
            }
        }
    }

    h3 {
        margin-top: 50px;
    }

    h4 {
        text-align: center;
        font-weight: 900;
    }

    .desc {
        margin-top: 15px;
    }

    .exchanges {
        grid-gap: 15px;
        grid-template-columns: repeat(2,minmax(0, 1fr));
        display: grid;
        margin-top: 30px;

        a {
            border: 2px solid #F5F5F3;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 100ms;
            min-height: 240px;

            @media (max-width: 500px) {
                min-height: 200px;
                img {
                    transform: scale(0.7);
                }
            }

            @media (max-width: 380px) {
                min-height: 164px;
            }
    
            :hover {
                border-color: #8FCDFF;
                background-color: #F0F9FF;
            }
        }
    }
`

export function BuyNear({ match, location, history }) {
    const dispatch = useDispatch();
    const { accountId, balance } = useSelector(({ account }) => account);

    return (
        <StyledContainer className='small-centered'>
            <FormButton
                color='link go-back'
                onClick={() => history.goBack()}
            >
                <ArrowIcon/>
            </FormButton>
            <h4><Translate id='buyNear.title' /></h4>
            <h3>MoonPay</h3>
            <div className='desc'>Purchase NEAR through MoonPay using your preferred payment method.</div>
            <FormButton
                color='link learn-more'
                linkTo='https://www.moonpay.com/'
            >
                <Translate id='button.learnMore' />
            </FormButton>
            <FormButton
                color='black'
                linkTo='https://www.moonpay.com/'
            >
                Buy with
                <MoonPayIcon/>
            </FormButton>
            <h3>Supported Exchanges</h3>
            <div className='desc'>NEAR is available to purchase through the following exchanges.</div>
            <div className='exchanges'>
                <a href='https://www.binance.com/' target='_blank' rel='noreferrer'>
                    <img src={BinanceLogo} alt='BINANCE'/>
                </a>
                <a href='https://www.huobi.com/' target='_blank' rel='noreferrer'>
                    <img src={HuobiLogo} alt='HUOBI'/>
                </a>
                <a href='https://www.okex.com/' target='_blank' rel='noreferrer'>
                    <img src={OkexLogo} alt='OKEX'/>
                </a>
            </div>
        </StyledContainer>
    )
}