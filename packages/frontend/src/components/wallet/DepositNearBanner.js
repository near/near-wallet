import { push } from 'connected-react-router';
import React from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import NearLogoAndPlusIcon from '../svg/NearLogoAndPlusIcon';

const StyledContainer = styled.div`
    @media (max-width: 991px) {
        margin-bottom: 40px;
    }
    > div {        
        > div {
            background-color: #F0F0F1;
            border-radius: 8px;
            display: flex;
            align-items: center;
            padding: 15px;
            cursor: pointer;

            :hover {
                background-color: #ECECEC;
            }
    
            > div {
                margin-left: 15px;
        
                .banner-title {
                    color: #272729;
                    font-weight: 500;
                    font-size: 16px;
                }
        
                .banner-desc {
                    margin-top: 5px;
                    color: #72727A;
                    line-height: 1.5;
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
    const dispatch = useDispatch();

    return (
        <StyledContainer className='deposit-near-banner'>
            <div>
                <div onClick={() => dispatch(push({ pathname: '/receive-money' }))} >
                    <NearLogoAndPlusIcon />
                    <div>
                        <div className='banner-title'><Translate id='wallet.depositNear.title' /></div>
                        <div className='banner-desc'><Translate id='wallet.depositNear.desc' /></div>
                    </div>
                </div>
            </div>
        </StyledContainer>
    );
};
