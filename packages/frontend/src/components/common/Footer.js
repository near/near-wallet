import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { isWhitelabel } from '../../config/whitelabel';
import NearLogo from '../../images/near.svg';
import { Mixpanel } from '../../mixpanel/index';
import MyNearWalletLogo from '../svg/MyNearWalletLogo';

const StyledContainer = styled.div`
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    padding: 35px;
    background-color: #f8f8f8;
    font-size: 12px;
    color: #999999;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 768px) {
        justify-content: space-between;
    }

    .left {
        display: flex;
        flex-direction: column;
        align-items: center;

        @media (min-width: 768px) {
            flex-direction: row;
        }

        > div {
            text-align: center;
            margin: 20px 0 0 0;

            @media (min-width: 768px) {
                text-align: left;
                margin: 0 0 0 20px;
            }

            .color-brown-grey {
                margin: 0 5px;
            }
        }

        img {
            opacity: 0.3;
            width: 125px;
        }

        a {
            color: #999999;
            text-decoration: underline;
        }
    }

    .center {
        display: none;
        color: #24272a;
        width: 30%;

        @media (min-width: 992px) {
            display: block;
        }
    }

    .right {
        display: none;
        font-size: 18px;
        font-weight: 600;
        line-height: 130%;

        @media (min-width: 768px) {
            display: block;
        }
    }
`;

const StyledLogo = styled.div`
    svg {
        width: 218px;    
    }
`;

const Footer = () => {
    return (
        <StyledContainer className='wallet-footer'>
            <div className='left'>
                {
                    isWhitelabel() ? (
                        <StyledLogo>
                            <MyNearWalletLogo mode='footer' />
                        </StyledLogo>
                    ) : <img src={NearLogo} alt='NEAR' />
                }
                <div>
                    &copy; {new Date().getFullYear()} <Translate id='footer.copyrights' />
                    <div>
                        <a
                            href='/terms'
                            rel='noopener noreferrer'
                            target='_blank'
                            onClick={() => Mixpanel.track('Footer Click terms of service')}
                        >
                            <Translate id='footer.termsOfService' />
                        </a>
                        <span className='color-brown-grey'>|</span>
                        <a href='/privacy'
                            rel='noopener noreferrer'
                            target='_blank'
                            onClick={() => Mixpanel.track('Footer Click privacy policy')}
                        >
                            <Translate id='footer.privacyPolicy' />
                        </a>
                    </div>
                </div>
            </div>
            <div className='center'>
                <Translate id='footer.desc' />&nbsp;
                <a
                    href='https://near.org'
                    rel='noopener noreferrer'
                    target='_blank'
                    onClick={() => Mixpanel.track('Footer Click Learn More')}
                >
                    <Translate id='footer.learnMore' />
                </a>
            </div>
            <div className='right'>
                <Translate id='footer.needHelp' /><br />
                <a
                    href={isWhitelabel() ? 'https://discord.com/invite/Vj74PpQYsh' : 'https://near.chat'}
                    rel='noopener noreferrer'
                    target='_blank'
                    onClick={() => Mixpanel.track('Footer Click Join Community')}
                >
                    <Translate id='footer.contactSupport' />
                </a>
            </div>
        </StyledContainer>
    );
};

export default Footer;
