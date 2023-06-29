import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Container from '../common/styled/Container.css';
import Banner from './components/Banner';
import ExploreSection from './components/ExploreSection';
import TrandingProjects from './components/TrandingProjects';
import { trandingProjects, exchangeSection, startEarningSection, collectNFTsSection, playToEarnSection } from './content';

const StyledContainer = styled(Container)`
    padding: 0 14px 30px 14px;
`;

const StyledH1 = styled.h1`
    font-weight: 800;
    font-size: 28px;
    line-height: 36px;
    display: flex;
    align-items: center;
    margin-top: 0;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        display: none;
    }
`;

export function ExploreContainer() {    
    return (
        <StyledContainer>
            <StyledH1><Translate id='explore.sectionName'/></StyledH1>
            <Banner />
            <TrandingProjects projects={trandingProjects}/>
            <ExploreSection content={exchangeSection} translationId='explore.categories.exchanges' />
            <ExploreSection content={startEarningSection} translationId='explore.categories.startEarning' />
            <ExploreSection content={collectNFTsSection} translationId='explore.categories.collectNFTs' />
            <ExploreSection content={playToEarnSection} translationId='explore.categories.playToEarn' />
        </StyledContainer>
    );
}
