import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import IconCheckImage from '../../images/icon-check.svg';
import Image from '../common/image';


const LoginCliLoginSuccessWrapper = styled('section')`
    width: 100%;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    text-align: center;

    @media (max-width: 768px) {
        padding: 16px;
    }

    .title{
        margin-top: 16px;
    }

`;


const CustomImage = styled(Image)`
    width: 48px;
    height: 48px;
    margin: 0 auto;
`;

export const LoginCliLoginSuccess = () => (
    <LoginCliLoginSuccessWrapper>
         <CustomImage src={IconCheckImage} />
        <h2 className='title'>
            <Translate id='login.cliLoginSuccess.pageTitle' />
        </h2>
        <p className='color-black'>
            <Translate id='login.cliLoginSuccess.pageText' />
        </p>
    </LoginCliLoginSuccessWrapper>
);
