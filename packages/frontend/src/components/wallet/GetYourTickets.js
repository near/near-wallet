import React from 'react';
import styled from 'styled-components';

import NearCon from '../../images/nearcon-wallet.png';

const Container = styled.div`
    && {
        border-radius: 8px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        color: #d5d4d8;
        font-size: 14px;
        margin-bottom: 40px;

        & div {
            position: relative;
        }
    }
`;

const StyledBannerLink = styled.a`
    margin-top: 12px;
    width: 270px;
    height: 35px;
    background: #604cc8;
    color: #fff;
    border: 2px solid #604cc8;
    border-radius: 50px;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    position: absolute;
    left: 24px;
    bottom: 18px;

    &:hover {
        color: #fff;
        text-decoration: none;
        cursor: pointer;
    }
`;

const GetYourTicket = () => {
    return (
        <Container>
            <div>
                <img src={NearCon} alt='NearCon-wallet'/>
                    <StyledBannerLink href="https://near.org/nearcon23.near/widget/Index" target="_blank">
                    GET YOUR TICKETS
                    </StyledBannerLink>
            </div>


        </Container>
    );
};

export default GetYourTicket;
