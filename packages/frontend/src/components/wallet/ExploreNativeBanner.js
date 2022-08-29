import React from 'react';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import exploreAppsImg from '../../images/exploreAppsBanner.png';

const Container = styled.div`
    padding: 16px;
    padding-bottom: 81px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: linear-gradient(180deg, #E8FAFF 0%, #D7E0FF 100%);
    border-radius: 8px;
    color: #25272A;

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

const BannerLink = styled(Link)`
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
        <Container>
            <img src={exploreAppsImg} alt="Explore Apps Banner" />
            <h2><Translate id='exploreApps.exploreNear'/></h2>
            <div><Translate id='exploreApps.text'/></div>
            <BannerLink to="/explore">
                <Translate id='exploreApps.exploreApps'/>
            </BannerLink>
        </Container>
    );
};

export default ExploreNativeBanner;
