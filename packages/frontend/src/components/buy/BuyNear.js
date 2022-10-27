import React, { useState, useEffect, useMemo } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { getPayMethods } from '../../config/buyNearConfig';
import { Mixpanel } from '../../mixpanel';
import { selectAccountId } from '../../redux/slices/account';
import { isMoonpayAvailable, getSignedUrl } from '../../utils/moonpay';
import { buildFtxPayLink } from '../accounts/create/FundWithFtx';
import { buildUtorgPayLink } from '../accounts/create/FundWithUtorg';
import BackArrowButton from '../common/BackArrowButton';
import Container from '../common/styled/Container.css';
import { FundingCard } from './FundingCard';
import { buildTransakPayLink } from './providers/transak';

const StyledContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0;

    .wrapper {
        display: grid;
        grid-template-columns: repeat(3, 370px);
        grid-gap: 0 30px;
        align-items: start;
        justify-content: center;
        width: 100%;
    }

    @media (max-width: 580px) {
        .wrapper {
            grid-template-columns: 90%;
            grid-gap: 24px 0;
        }
    }

    @media (min-width: 580px) and (max-width: 992px) {
        width: calc(100% - 48px);
        .wrapper {
            grid-template-columns: 1fr;
            grid-gap: 32px 0;
        }
    }

    @media (min-width: 992px) and (max-width: 1200px) {
        width: 960px;
        .wrapper {
            grid-template-columns: repeat(3, 300px);
        }
    }

    @media (min-width: 1200px) {
        width: 1170px;
    }
`;

const StyledHeader = styled.div`
    width: 100%;
    margin: 2em 0 7.75rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    @media (max-width: 580px) {
        width: 90%;
        margin: 0 auto 30px;
        grid-template-columns: 100%;
        grid-gap: 20px 0;
    }

    .back-arrow-button {
        position: relative;
        top: -6px;
        left: -12px;
    }

    .title {
        font-size: 25px;
        font-weight: 900;
        text-align: center;
        color: #111618;
    }

    .subTitle {
        width: 348px;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        font-weight: 500;

        @media (max-width: 430px) {
            width: 296px;
        }

        @media (max-width: 320px) {
            width: auto;
        }
    }
`;

export function BuyNear({ history }) {
    const accountId = useSelector(selectAccountId);
    const [moonPayAvailable, setMoonPayAvailable] = useState(true);
    const [signedMoonPayUrl, setSignedMoonPayUrl] = useState(null);
    const [utorgPayUrl, setUtorgPayUrl] = useState(null);
    const [transakPayUrl, setTransakPayUrl] = useState(null);
    const [ftxPayUrl, setFtxPayUrl] = useState(null);

    const goBack = () => history.goBack();

    useEffect(() => {
        if (!accountId) {
            return;
        }

        setUtorgPayUrl(buildUtorgPayLink(accountId));
        setFtxPayUrl(buildFtxPayLink(accountId));
        setTransakPayUrl(buildTransakPayLink(accountId));
        checkMoonPay();
    }, [accountId]);

    const PayMethods = useMemo(
        () => getPayMethods({
            accountId,
            transakPayUrl,
            moonPayAvailable,
            signedMoonPayUrl,
            utorgPayUrl,
            ftxPayUrl
        }),
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

    const onrampMethods = [
        PayMethods.moonPay,
        PayMethods.transak,
        PayMethods.utorg,
        PayMethods.nearPay,
        PayMethods.ftx
    ].filter((v) => !!v);

    return (
        <StyledContainer>
            <StyledHeader>
                <BackArrowButton color="var(--color-1)" onClick={goBack} />
                <div>
                    <div className='title'><Translate id='buyNear.title' /></div>
                    <h2 className='subTitle'><Translate id='buyNear.subTitle' /></h2>
                </div>
            </StyledHeader>

            <div className='wrapper'>
                <FundingCard
                    title='buyNear.nearPurchaseTitle'
                    subTitle='buyNear.nearPurchaseSubTitle'
                    actions={onrampMethods}
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
                    actions={[PayMethods.okex, PayMethods.binance, PayMethods.huobi, PayMethods.kraken]}
                />
            </div>
        </StyledContainer>
    );
}
