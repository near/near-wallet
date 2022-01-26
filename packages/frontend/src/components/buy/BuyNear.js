import React, { useState, useEffect } from "react";
import { Translate } from "react-localize-redux";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { useBuyWithNearpay } from "../../hooks/buyWithNearpay";
import BinanceLogo from "../../images/binance-logo.svg";
import GateLogo from "../../images/gate-io-logo.svg";
import HuobiLogo from "../../images/huobi-logo.svg";
import LiqualityLogo from "../../images/liquality-logo.svg";
import OkCoinLogo from "../../images/ok-coin-logo.svg";
import OkexLogo from "../../images/okex-logo.svg";
import RainbowBridgeLogo from "../../images/rainbow-bridge-logo.svg";
import { Mixpanel } from "../../mixpanel";
import { selectAccountId } from "../../redux/slices/account";
import { isMoonpayAvailable, getSignedUrl } from "../../utils/moonpay";
import FormButton from "../common/FormButton";
import Container from "../common/styled/Container.css";
import ArrowIcon from "../svg/ArrowIcon";
import MoonPayIcon from "../svg/MoonPayIcon";
import NearPayIcon from "../svg/NearPayIcon";

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

        &.black,
        &.gray-gray {
            width: 100% !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
            border: 0 !important;

            svg {
                margin: -3px 0 0 10px !important;
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

    .desc {
        margin-top: 15px;
    }

    a {
        :not(.link) {
            border: 2px solid #f5f5f3;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 100ms;
            min-height: 240px;

            :hover {
                border-color: #8fcdff;
                background-color: #f0f9ff;
            }

            &.bridge {
                min-height: 200px;
                margin-top: 30px;

                @media (max-width: 380px) {
                    min-height: 164px;
                }
            }
        }
    }

    .exchanges {
        grid-gap: 15px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
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
`;

export function BuyNear({ match, location, history }) {
    const accountId = useSelector(selectAccountId);
    const [moonPayAvailable, setMoonPayAvailable] = useState(null);
    const [signedMoonPayUrl, setSignedMoonPayUrl] = useState(null);
    const nearpay = useBuyWithNearpay(accountId);

    useEffect(() => {
        if (!accountId) {
            return;
        }

        checkMoonPay();
    }, [accountId]);

    const checkMoonPay = async () => {
        await Mixpanel.withTracking(
            "Wallet Check Moonpay available",
            async () => {
                const moonPay = await isMoonpayAvailable();
                setMoonPayAvailable(moonPay);
                if (moonPay) {
                    const url = await getSignedUrl(
                        accountId,
                        window.location.origin
                    );
                    setSignedMoonPayUrl(url);
                }
            },
            (e) => console.warn("Error checking Moonpay", e)
        );
    };

    return (
        <StyledContainer className="small-centered">
            <FormButton color="link go-back" onClick={() => history.goBack()}>
                <ArrowIcon />
            </FormButton>
            <h4>
                <Translate id="buyNear.title" />
            </h4>
            <h3>
                <Translate id="buyNear.moonPay" />
            </h3>
            <div className="desc">
                <Translate id="buyNear.descOne" />
            </div>
            <FormButton
                color="link learn-more"
                linkTo="https://support.moonpay.com/"
            >
                <Translate id="button.learnMore" />
            </FormButton>
            <FormButton
                sending={!accountId || nearpay.isAvailable == null}
                sendingString="button.loading"
                disabled={accountId && !nearpay.isAvailable}
                color={nearpay.isAvailable ? "black" : "gray-gray"}
                linkTo={nearpay.url}
                onClick={() => Mixpanel.track("Wallet Click Buy with Nearpay")}
            >
                {nearpay.isAvailable ? (
                    <>
                        <Translate id="buyNear.buyWith" />
                        <NearPayIcon />
                    </>
                ) : (
                    <>
                        <NearPayIcon color="#3F4045" />
                        <Translate id="buyNear.notSupported" />
                    </>
                )}
            </FormButton>
            <FormButton
                sending={!accountId || moonPayAvailable == null}
                sendingString="button.loading"
                disabled={accountId && !moonPayAvailable}
                color={moonPayAvailable ? "black" : "gray-gray"}
                linkTo={signedMoonPayUrl}
                onClick={() => Mixpanel.track("Wallet Click Buy with Moonpay")}
            >
                {moonPayAvailable ? (
                    <>
                        <Translate id="buyNear.buyWith" />
                        <MoonPayIcon />
                    </>
                ) : (
                    <>
                        <MoonPayIcon color="#3F4045" />
                        <Translate id="buyNear.notSupported" />
                    </>
                )}
            </FormButton>
            <h3>
                <Translate id="buyNear.supportedExchanges" />
            </h3>
            <div className="desc">
                <Translate id="buyNear.descTwo" />
            </div>
            <div className="exchanges">
                <a
                    href="https://www.binance.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img src={BinanceLogo} alt="BINANCE" />
                </a>
                <a
                    href="https://www.huobi.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img src={HuobiLogo} alt="HUOBI" />
                </a>
                <a
                    href="https://www.okex.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img src={OkexLogo} alt="OKEX" />
                </a>
                <a href="https://www.gate.io/" target="_blank" rel="noreferrer">
                    <img src={GateLogo} alt="GATE" />
                </a>
                <a
                    href="https://liquality.io/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img src={LiqualityLogo} alt="LIQUALITY" />
                </a>
                <a
                    href="https://www.okcoin.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        src={OkCoinLogo}
                        alt="OKCOIN"
                        className="ok-coin-img"
                    />
                </a>
            </div>
            <div className="see-more">
                <Translate id="buyNear.seeMore" />{" "}
                <a
                    href="https://coinmarketcap.com/currencies/near-protocol/markets/"
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                >
                    <Translate id="buyNear.coinMarketCap" />
                </a>
            </div>
            <h3>
                <Translate id="buyNear.bridgeTokens" />
            </h3>
            <div className="desc">
                <Translate id="buyNear.descThree" />
            </div>
            <a
                href="https://rainbowbridge.app/transfer"
                target="_blank"
                rel="noreferrer"
                className="bridge"
            >
                <img
                    src={RainbowBridgeLogo}
                    alt="Rainbow Bridge"
                    className="rainbow-bridge-img"
                />
            </a>
        </StyledContainer>
    );
}
