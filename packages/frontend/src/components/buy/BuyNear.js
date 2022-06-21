import { shuffle } from 'lodash';
import React, { useState, useEffect, useMemo } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { getPayMethods } from '../../config/buyNearConfig';
import { Mixpanel } from '../../mixpanel';
import { selectAccountId } from '../../redux/slices/account';
import { isMoonpayAvailable, getSignedUrl } from '../../utils/moonpay';
import { buildUtorgPayLink } from '../accounts/create/FundWithUtorg';
import FormButton from '../common/FormButton';
import ArrowIcon from '../svg/ArrowIcon';
import { FundingCard } from './FundingCard';

const StyledContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    
    button {
        display: block !important;
        svg {
            width: initial !important;
            height: initial !important;
            margin: initial !important;
        }

        &.go-back {
            position: absolute;
            top: 0;
            left: -13px;
            min-height: 42px !important;
            height: 42px !important;
            min-width: 42px !important;
            width: 42px !important;
            border-radius: 50% !important;
            :hover {
                background-color: #eeefee !important;
            }
            @media (max-width: 991px) {
                top: -9px;
                left: 1px;
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

        &.black, &.gray-gray {
            width: 100% !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
            border: 0 !important;
            svg {
                margin: -3px 0 0 10px !important;
            }
            
            img {
                margin: -3px 0 0 10px !important;
                height: 40% !important;
            }
        }
        &.gray-gray svg {
            margin-right: 4px !important;
        }
    }

    h3 {
        margin-top: 50px;
    }

    h4 {
        text-align: center;
        font-weight: 900;
    }
    .title{
        font-size: 25px;
        font-weight: 900;
        color: #111618;
    }
    .subTitle{
        width: 348px;
        font-size: 16px;
        font-weight: 500;
        color: #72727A;
        text-align: center;
        margin: 22px 0 124px;
        @media (max-width: 992px) {
            margin: 22px 0 72px;
         }
        @media (max-width: 358px) {
            margin: 22px 0 72px;
        }
    }
    .wrapper{
        display: grid;
        grid-template-columns: repeat(3, 370px);
        grid-template-rows: 426px;
        grid-gap: 0 30px;
        align-items: start;
        justify-content: center;
        width:100%;
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
            @media (max-width: 500px) {
                min-height: 200px;
                img {
                    transform: scale(0.7);
                }
            }
            @media (max-width: 380px) {
                min-height: 164px;
            }
        }
        .ok-coin-img {
            max-width: 130px;
        }
    }
    .see-more {
        margin-top: 30px;
    }

    @media (max-width: 580px) {
        .wrapper{
            grid-template-columns: 90%; 
            grid-gap: 24px 0;
        }
    }

    @media (min-width: 580px) and (max-width: 992px)  {
        width: calc(100% - 48px);
        margin: 0 24px;
        .wrapper{
            grid-template-columns: 1fr;
            grid-template-rows: 204px 170px 218px;
            grid-gap: 32px 0;
        }
    }
    @media (min-width: 992px) and (max-width: 1200px) {
        .wrapper{
            grid-template-columns: repeat(3, 300px);
        }
    }
    @media (min-width: 1200px) {
        width: 1170px;
    }
    @media (max-width: 358px) {
        .subTitle{
            width: 296px;
        }
    }
`;



export function BuyNear({ match, location, history }) {
    const accountId = useSelector(selectAccountId);
    const [moonPayAvailable, setMoonPayAvailable] = useState(null);
    const [signedMoonPayUrl, setSignedMoonPayUrl] = useState(null);
    const [utorgPayUrl, setUtorgPayUrl] = useState(null);

    useEffect(() => {
        if (!accountId) {
            return;
        }

        setUtorgPayUrl(buildUtorgPayLink(accountId));
        checkMoonPay();
    }, [accountId]);

    const PayMethods = useMemo(
        () => getPayMethods({ accountId, moonPayAvailable, signedMoonPayUrl, utorgPayUrl }),
        [accountId, moonPayAvailable, signedMoonPayUrl, utorgPayUrl]
    );
    
    const checkMoonPay = async () => {
        await Mixpanel.withTracking('Wallet Check Moonpay available',
            async () => {
                const moonPay = await isMoonpayAvailable();
                setMoonPayAvailable(moonPay);
                if (moonPay) {
                    const url = await getSignedUrl(accountId, window.location.origin);
                    setSignedMoonPayUrl(url);
                }
            },
            (e) => console.warn('Error checking Moonpay', e)
        );
    };

    return (
        <StyledContainer>
            <FormButton
                color='link go-back'
                onClick={() => history.goBack()}
            >
                <ArrowIcon />
            </FormButton>
            <div className='title'><Translate id='buyNear.title' /></div>
            <div className='subTitle'><Translate id='buyNear.subTitle' /></div>
            <div className='wrapper'>
                <FundingCard
                    title='buyNear.nearPurchaseTitle'
                    subTitle='buyNear.nearPurchaseSubTitle'
                    actions={shuffle([PayMethods.moonPay, PayMethods.nearPay, PayMethods.utorg, PayMethods.ftx])}
                />
                <FundingCard
                    title='buyNear.bridgeTokens'
                    subTitle='buyNear.bridgeSubTitle'
                    actions={[PayMethods.rainbow]}
                />
                <FundingCard title='buyNear.supportedExchanges'
                    subTitle='buyNear.supportedSubTitle'
                    link={{
                        url: 'https://coinmarketcap.com/currencies/near-protocol/markets/',
                        title: 'buyNear.coinMarketLink'
                    }}
                    actions={[PayMethods.okex, PayMethods.binance, PayMethods.huobi]}
                />
            </div>
        </StyledContainer>
    );
}
