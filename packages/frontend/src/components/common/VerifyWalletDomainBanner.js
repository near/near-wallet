import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { IS_MAINNET, SHOW_PRERELEASE_WARNING } from '../../config';
import getWalletURL from '../../utils/getWalletURL';
import LockIcon from '../svg/LockIcon';

const StyledContainer = styled.div`
    background-color: #fafafa;
    margin: 0 auto;
    text-align: center;
    padding: 10px 20px;
    margin: -5px 0 40px 0;

    &.network-banner {
        margin: -15px 0 40px 0;
    }

    svg {
        width: 20px;
        margin: -1px 6px 0 0;
    }

    span {
        color: #24272a;
        :first-of-type {
            color: #00C08B;
        }
    }
    
    .mobile {
        @media (min-width: 768px) {
            display: none;
        }
        > div {
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .desktop {
        display: flex;
        align-items: center;
        justify-content: center;

        @media (max-width: 767px) {
            display: none;
        }
    }
`;

const WalletURLString = () => <><span>https://</span><span>{getWalletURL(false)}</span></>;

export default () => {
    return (
        <StyledContainer className={(SHOW_PRERELEASE_WARNING || !IS_MAINNET) ? 'network-banner' : ''}>
            <div className='desktop'>
                <LockIcon color='#00C08B' />
                <Translate id='verifyWalletDomainBanner.title' />
                &nbsp;
                <WalletURLString/>
            </div>
            <div className='mobile'>
                <Translate id='verifyWalletDomainBanner.title' />
                <div>
                    <LockIcon color='#00C08B' />
                    <WalletURLString/>
                </div>
            </div>
        </StyledContainer>
    );
};
