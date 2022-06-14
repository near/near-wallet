import React from 'react';
import styled from 'styled-components';

import arrow from './assets/arrow.svg';

const LinkWrap = styled.a`
    display: block;
    border-top: 1px solid #F0F0F1;

    &:hover{
        background: #f9f9f9;
    }
    
    @media (max-width: 992px) {
        :first-child{
            border: 0;
        }
    }
    @media (max-width: 580px) {
        :first-child{
            border-top: 1px solid #F0F0F1;
        }
    }
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 68px;
    padding: 0 32px;
    @media (max-width: 580px) {
        padding: 0 12px;
    }
`;

const Button = styled.div`
    background-image: url(${arrow});
    width: 24px;
    height: 24px;
`;

const WrapperImg = styled.div`
    display: flex;
`;

export const FundingType = ({ icon, link, name, track, ref }) => {
    return (
        <LinkWrap href={link} target='_blank' rel={!ref ? 'noreferrer' : 'noopener'} onClick={() => track && track()}>
            <Wrapper>
                <WrapperImg title={name}>
                    <img src={icon} alt="" />
                </WrapperImg>
                <Button />
            </Wrapper>
        </LinkWrap>
    );
};
