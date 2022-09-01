import React from 'react';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { SHOW_EXPLORE_PAGE } from '../../../../../features';
import exploreAppsImg from '../../images/exploreAppsBanner.png';

const AWESOME_NEAR_URL = 'https://awesomenear.com/projects';

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    & h2 {
        margin: 24px 0 0 0!important;
        font-size: 20px!important;
        line-height: 26px;
        align-self: center!important;
    }

    & div {
        margin-top: 16px;
        font-weight: 500;
        font-size: 14px;
        line-height: 21px;
    }
`;

const StyledBannerLinkTemporary = styled.a`
    margin-top: 24px;
    width: 100%;
    height: 48px;
    background: #FFFFFF;
    border: 2px solid #FFFFFF;
    border-radius: 50px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
`;

const StyledBannerLink = styled(Link)`
    margin-top: 24px;
    width: 100%;
    height: 48px;
    background: #FFFFFF;
    border: 2px solid #FFFFFF;
    border-radius: 50px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
`;

const ExploreNativeBanner = () => {
    return (
        <StyledContainer>
            <img src={exploreAppsImg} alt="Explore Apps Banner" width="211" height="180" />
            <h2><Translate id='exploreApps.exploreNear' /></h2>
            <div><Translate id='exploreApps.text' /></div>
            {!SHOW_EXPLORE_PAGE ? (
                <StyledBannerLink to='/explore'>
                    <Translate id='exploreApps.exploreApps' />
                </StyledBannerLink>
            ) : (
                <StyledBannerLinkTemporary href={AWESOME_NEAR_URL} target='_blank' rel='noopener noreferrer'>
                    <Translate id='exploreApps.exploreApps' />
                </StyledBannerLinkTemporary>
            )}
        </StyledContainer>
    );
};

export default ExploreNativeBanner;
