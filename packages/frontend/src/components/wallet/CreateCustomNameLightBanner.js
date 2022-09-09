import React from 'react';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import NewAccountIdGraphic from '../common/graphics/NewAccountIdGraphic';

const Container = styled.div`
    &&& {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        color: #d5d4d8;
        font-size: 14px;
        padding-top: 8px;

        h2 {
            color: #25272A;
            align-self: center;
            margin: 15px 0;
            text-align: center;
            margin-top: 10px;
        }

        .desc {
            margin-bottom: 16px;
            color: #25272A;
        }

        .id-graphic {
            background-color: white;
            color: #25272A;
        }
    }
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

export default () => {
    return (
        <Container>
            <NewAccountIdGraphic accountId='satoshi.near'/>
            <h2>
                <Translate id='account.createImplicitAccount.createCustomNameModal.title' />
            </h2>
            <div className='desc'>
                <Translate id='account.createImplicitAccount.createCustomNameModal.desc' />
            </div>
            <StyledBannerLink to="/create">
                <Translate id='button.addACustomAddress'/>
            </StyledBannerLink>
        </Container>
    );
};
