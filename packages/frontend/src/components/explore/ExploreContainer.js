import React from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { selectAvailableBalance } from '../../redux/slices/account';
import { formatNearAmount } from '../common/balance/helpers';
import Container from '../common/styled/Container.css';
import Banner from './components/Banner';
import ExploreSection from './components/ExploreSection';
import TrandingProjects from './components/TrandingProjects';
import { trandingProjects, exchangeSection, startEarningSection, collectNFTsSection, playToEarnSection } from './content';

const StyledContainer = styled(Container)`
    
    h1 {
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
    }

`;


export function ExploreContainer() {    
    const nearBalance = useSelector(selectAvailableBalance) || 0;
    const isBannerAvailable = formatNearAmount(nearBalance) > 0.1;

    return (
        <StyledContainer>
            <h1><Translate id='explore.sectionName'/></h1>
            {isBannerAvailable && <Banner />}
            <TrandingProjects projects={trandingProjects}/>
            <ExploreSection content={exchangeSection} />
            <ExploreSection content={startEarningSection} />
            <ExploreSection content={collectNFTsSection} />
            <ExploreSection content={playToEarnSection} />
        </StyledContainer>
    );
}
