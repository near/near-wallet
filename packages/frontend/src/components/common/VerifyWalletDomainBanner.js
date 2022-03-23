import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import LockIcon from '../svg/LockIcon';

const StyledContainer = styled.div`
    background-color: #fafafa;
    border-radius: 8px;
    margin: 0 auto;
    text-align: center;
    padding: 10px 20px;
    margin: -5px 0 40px 0;

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

export default () => {
    return (
        <StyledContainer>
            <div className='desktop'>
                <LockIcon color='#00C08B' /><Translate id='verifyWalletDomainBanner.title' />&nbsp;<span>https://</span><span>wallet.near.org</span>
            </div>
            <div className='mobile'>
                <Translate id='verifyWalletDomainBanner.title' />
                <div>
                    <LockIcon color='#00C08B' /><span>https://</span><span>wallet.near.org</span>
                </div>
            </div>
        </StyledContainer>
    );
};
