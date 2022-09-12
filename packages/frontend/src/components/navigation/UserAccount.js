import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../utils/theme';
import classNames from '../../utils/classNames';
import ChevronIcon from '../svg/ChevronIcon';
import UserIcon from '../svg/UserIcon';


const Container = styled.div`
    background: #F0F0F1;
    display: flex;
    align-items: center;
    background: ${COLORS.darkGreen};
    border-radius: 15px;
    padding: 2px 20px;
    cursor: pointer;
    user-select: none;
    height: 60px;
    
    .user-icon {
        min-width: 36px;
        min-height: 36px;
        
        .background {
            fill: transparent;
        }
    }

    .account-wrapper {
        font-weight: 400;
        font-size: 18px;
        line-height: 24px;
        margin: 0 66px 0 10px;
        white-space: nowrap;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: ${COLORS.green};

        @media (max-width: 991px) {
            margin: 0 14px 0 12px;
        }
    }

    .icon-wrapper {
        min-width: 28px;
        min-height: 28px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(90deg);

        svg {
            width: 7px;
        }
    }

    &.no-click {
        pointer-events: none;

        .icon-wrapper {
            display: none;
        }
    }
`;

const UserAccount = (
    {
        accountId = '',
        onClick,
        withIcon = true,
        flowLimitationSubMenu
    }
) => {
    const containerClass = classNames([
        'user-account',
        { 'no-click' : flowLimitationSubMenu }
    ]);

    return (
        <Container
            className={containerClass}
            onClick={onClick}
        >
            {withIcon && <UserIcon color='#A2A2A8'/>}
            <div className='account-wrapper' data-test-id='currentUser'>
                {accountId}
            </div>
            <div className='icon-wrapper'>
                <ChevronIcon />
            </div>
        </Container>
    );
};

export default UserAccount;
