import React from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { redirectTo } from '../../../actions/account';

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid #F0F0F1;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 50px;

    > div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #F0F0F1;
        color: #A2A2A8;
        font-weight: 600;
        padding: 15px;
        cursor: pointer;
        font-size: 16px;
        transition: color 100ms;
        min-height: 56px;

        &:not(.active) {
            :hover {
                color: black;
            }
        }

        &.active {
            background-color: white;
            color: #0072CE;
            cursor: default;
        }
    }

    @media (max-width: 500px) {
        margin: -26px -14px 0 -14px;
        border-radius: 0;
        border-bottom: 0;
    }
`;

const TabSelector = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const pathname = location.pathname;
    const sendMoneyRoute = '/send-money';
    const receiveMoneyRoute = '/receive-money';

    //TODO: Replace tab selector in Wallet.js with this component

    return (
        <StyledContainer>
            <div 
                role='button'
                className={pathname === sendMoneyRoute ? 'active' : ''}
                onClick={pathname !== sendMoneyRoute ? () => dispatch(redirectTo(sendMoneyRoute)) : null}
            >
                <Translate id='button.send'/>
            </div>
            <div
                role='button'
                className={pathname === receiveMoneyRoute ? 'active' : ''}
                onClick={pathname !== receiveMoneyRoute ? () => dispatch(redirectTo(receiveMoneyRoute)) : null}
            >
                <Translate id='button.receive'/>
            </div>
        </StyledContainer>
    );
};

export default TabSelector;