import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import NearLogoAndPlusIcon from '../svg/NearLogoAndPlusIcon';

const StyledContainer = styled.div`
    width: 100%;

    @media (max-width: 991px) {
        margin-bottom: 40px;
    }

    > div {
        border-top: 1px solid #F0F0F1;
        padding: 20px;

        @media (max-width: 991px) {
            margin: 0 -14px;
            padding: 20px 0;
            border-bottom: 15px solid #F0F0F1;
        }

        @media (max-width: 767px) {
            padding: 20px 14px 20px 14px;
        }
        
        > div {
            background-color: #F0F0F1;
            border-radius: 8px;
            display: flex;
            align-items: center;
            padding: 15px;
    
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
    
            > svg {
                min-width: 53px;
                min-height: 53px;
            }
        }
    }
`;

export default () => {
    return (
        <StyledContainer>
            <div>
                <div>
                    <NearLogoAndPlusIcon />
                    <div>
                        <div className='title'><Translate id='wallet.depositNear.title' /></div>
                        <div className='desc'><Translate id='wallet.depositNear.desc' /></div>
                    </div>
                </div>
            </div>
        </StyledContainer>
    );
};