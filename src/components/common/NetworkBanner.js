import React, { useEffect } from 'react';
import styled from 'styled-components';
import helpIconWhite from '../../images/icon-help-white.svg';
import helpIconBrown from '../../images/icon-help-brown.svg';
import { IS_MAINNET, SHOW_PRERELEASE_WARNING, NODE_URL } from '../../utils/wallet';
import { Modal } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import AlertTriangleIcon from '../svg/AlertTriangleIcon.js';

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

    a {
        color: white;

        :hover {
            color: white;
            text-decoration: underline;
        }
    }

    .trigger-string {
        display: flex;
        align-items: center;
        cursor: pointer;
        text-align: center;

        :after {
            content: '';
            background: url(${helpIconWhite}) center no-repeat;
            height: 16px;
            min-width: 16px;
            width: 16px;
            margin: 0 0 0 8px;
            display: inline-block;
        }
    }

    h4 {
        margin-bottom: 5px !important;
    }

    &.staging-banner {
        background-color: #F6C98E;
        color: #452500;

        .alert-triangle-icon {
            margin-right: 8px;
            min-width: 16px;
        }

        .trigger-string {
            :after {
                background: url(${helpIconBrown}) center no-repeat;
            }
        }
    }
`

const NetworkBanner = ({ account }) => {

    useEffect(() => {
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
                <Modal
                    size='mini'
                    trigger={
                        <div className='trigger-string'>
                            <Translate id='networkBanner.title' />&nbsp;
                            (<a href={`${NODE_URL}/status`} target='_blank' rel='noopener noreferrer' onClick={e => e.stopPropagation()}>
                                {NODE_URL.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]}
                            </a>)
                        </div>
                    }
                    closeIcon
                >
                    <h4><Translate id='networkBanner.header' /></h4>
                    <Translate id='networkBanner.desc' />
                </Modal>
            </Container>
        )
    } else if (SHOW_PRERELEASE_WARNING) {
        return (
            <Container id='top-banner' className='staging-banner'>
                <AlertTriangleIcon color='#A15600'/>
                <Modal 
                    size='mini'
                    trigger={
                        <div className='trigger-string'>
                            <Translate id='stagingBanner.title' />
                        </div>
                    }
                    closeIcon
                >
                    <Translate id='stagingBanner.desc' />
                </Modal>
            </Container>
        )
    } else {
        return null
    }
}

export default NetworkBanner;