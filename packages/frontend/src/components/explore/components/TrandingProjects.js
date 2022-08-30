import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import trandingProjectsIcon from '../media/trandingProjects.svg';

const StyledContainer = styled.div`
  width: 100%;
  background: linear-gradient(93.02deg, #CEF0FF -68.39%, #EDFCFF 14.93%, #D6DFFE 100%);
  border-radius: 16px;
  padding: 25px;
  margin-top: 25px;
  margin-bottom: 50px;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
`;

const StyledHeaderH2 = styled.h2`
  font-weight: 700!important;
  font-size: 22px!important;
  line-height: 33px!important;
  letter-spacing: 0.02em;
  color: #25272A!important;
  margin: 0!important;
  margin-left: 10px!important;
`;

const StyledArea = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  @media (max-width: 992px) {
    justify-content: space-between;
  }
`;

const StyledLink = styled.a`
  min-width: 132px;
  min-height: 117px;
  text-decoration: none!important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  color: #25272A;
  margin: 16px 0;

  @media (max-width: 992px) {
    flex: 33%;
  }
`;

const StyledImg = styled.img`
  margin-bottom: 9px;
  border-radius: 50%;
`;

export default function ({ projects }) {
    return (
        <StyledContainer>
            <StyledHeader>
                <img src={trandingProjectsIcon} alt="Tranding projects"/>
                <StyledHeaderH2><Translate id='explore.trendingProjects'/></StyledHeaderH2>
            </StyledHeader>
            <StyledArea>
                {projects.map((el) => (
                    <StyledLink key={el.name} href={`https://awesomenear.com/${el.linkName}`} target='_blank' rel='noopener noreferrer'>
                        <StyledImg src={el.icon} alt={el.name} width='80' height='80'/>
                        <div>{el.name}</div>
                    </StyledLink>
                ))}
            </StyledArea>
        </StyledContainer>
    );
}
