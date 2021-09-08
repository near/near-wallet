import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import NearLogoAndPlusIcon from '../svg/NearLogoAndPlusIcon';

const StyledContainer = styled.div`
    background-color: #F0F0F1;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 15px;

    > svg {
        min-width: 53px;
        min-height: 53px;
    }
    
    > div {
        margin-left: 15px;

        .title {
            color: #272729;
            font-weight: 500;
            font-size: 16px;
        }

        .desc {
            margin-top: 5px;
            color: #72727A;
        }
    }
`;

export default () => {
    return (
        <StyledContainer>
            <NearLogoAndPlusIcon/>
            <div>
                <div className='title'><Translate id='wallet.depositNear.title' /></div>
                <div className='desc'><Translate id='wallet.depositNear.desc' /></div>
            </div>
        </StyledContainer>
    );
};