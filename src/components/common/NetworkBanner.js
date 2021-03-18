import React, { useEffect } from 'react';
import styled from 'styled-components';
import helpIconWhite from '../../images/icon-help-white.svg';
import helpIconBrown from '../../images/icon-help-brown.svg';
import { IS_MAINNET, SHOW_PRERELEASE_WARNING, NODE_URL, NETWORK_ID } from '../../utils/wallet';
import { Translate } from 'react-localize-redux';
import AlertTriangleIcon from '../svg/AlertTriangleIcon.js';
import { Mixpanel } from "../../mixpanel/index";
import Tooltip from './Tooltip'

const Container = styled.div`
    color: white;
    background-color: #0072CE;
    position: fixed;
    padding: 10px;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    .tooltip {
        margin: 0 0 0 8px;
        svg {
            width: 18px;
            height: 18px;

            path {
                stroke: white;
            }
        }
    }

    .network-link {
        margin-left: 6px;
    }

    a {
        color: white;
        :hover {
            color: white;
            text-decoration: underline;
        }
    }

    &.staging-banner {
        background-color: #F6C98E;
        color: #452500;

        .tooltip {
            svg {
                path {
                    stroke: #452500;
                }
            }
        }

        .alert-triangle-icon {
            margin-right: 8px;
            min-width: 16px;
        }
    }
`

const NetworkBanner = ({ account }) => {

    useEffect(() => {
        Mixpanel.register({network_id: IS_MAINNET ? 'mainnet' : NETWORK_ID === 'default' ? 'testnet': NETWORK_ID})
        setBannerHeight()
        window.addEventListener("resize", setBannerHeight)
        return () => {
            window.removeEventListener("resize", setBannerHeight)
        }
    }, [account])

    const setBannerHeight = () => {
        const bannerHeight = document.getElementById('top-banner') && document.getElementById('top-banner').offsetHeight
        const app = document.getElementById('app-container')
        const navContainer = document.getElementById('nav-container')
        navContainer.style.top = bannerHeight ? `${bannerHeight}px` : 0
        app.style.paddingTop = bannerHeight ? `${bannerHeight + 85}px` : '75px'
    }

    if (!IS_MAINNET) {
        return (
            <Container id='top-banner'>
                <Translate id='networkBanner.title' />
                <span className='network-link'>
                    (<a href={`${NODE_URL}/status`} target='_blank' rel='noopener noreferrer'>
                        {NODE_URL.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]}
                    </a>)
                </span>
                <Tooltip translate='networkBanner.desc' modalOnly={true}/>
            </Container>
        )
    } else if (SHOW_PRERELEASE_WARNING) {
        return (
            <Container id='top-banner' className='staging-banner'>
                <AlertTriangleIcon color='#A15600'/>
                <Translate id='stagingBanner.title' />
                <Tooltip translate='stagingBanner.desc' modalOnly={true}/>
            </Container>
        )
    } else {
        return null
    }
}

export default NetworkBanner;