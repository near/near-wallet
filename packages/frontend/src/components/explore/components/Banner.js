import React from 'react';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import creditcard from '../media/creditcard.svg';

const StyledBannerLink = styled(Link)`
    width: 100%;
    height: 77px;
    display: flex;
    background: linear-gradient(92.8deg, #6BC1E7 0%, #6888FA 100%);
    border-radius: 16px;
    align-items: center;
    text-decoration: none!important;
    overflow: hidden;
    justify-content: space-between;
    padding: 0 60px;

    &:hover span {
        box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2)
    }

    @media (max-width: 768px) {
        padding: 0 30px;
    }
`;

const StyledBannerH2 = styled.h2`
    font-weight: 900!important;
    font-size: 20px!important;
    line-height: 26px!important;
    color: #FFFFFF!important;
    display: inline-block;
    text-align: center;
    min-width: 130px;
`;

const StyledBannerImg = styled.img`
    @media (max-width: 768px) {
      position: relative;
      top: 25px;
      width: auto;
      height: 200px;
    }
`;

const StyledBannerBtn = styled.span`
    background: #FFFFFF;
    border: 2px solid #FFFFFF;
    border-radius: 50px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #0072CE;
    align-items: center;
    justify-content: center;
    display: flex;
    height: 48px;
    width: 208px;

    @media (max-width: 768px) {
      display: none;
    }
`;

export default function () {
    return (
        <StyledBannerLink to='/buy'>
            <StyledBannerH2><Translate id='explore.banner.text'/></StyledBannerH2>
            <StyledBannerImg src={creditcard} alt='Buy NEAR'/>
            <StyledBannerBtn><Translate id='explore.banner.button'/></StyledBannerBtn>
        </StyledBannerLink>
    );
}
