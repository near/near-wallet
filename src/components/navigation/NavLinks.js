import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import summaryIcon from '../../images/icon-recent.svg';
import arrowIcon from '../../images/icon-send.svg';
import stakingIcon from '../../images/icon-staking-green.svg';
import { Translate } from 'react-localize-redux';
import { DISABLE_SEND_MONEY } from '../../utils/wallet';

const Container = styled.div`
    display: flex;

    @media (max-width: 991px) {
        flex-direction: column;
        align-items: flex-start;
    }

    @media (min-width: 992x) {
        align-items: center;
    }
`

const NavLink = styled(Link)`
    display: flex;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    cursor: pointer;
    transition: 100ms;
    color: white;
    padding-top: 2px;

    &:before {
        content: '';
        background: url(${props => props.icon});
        background-repeat: no-repeat;
        display: inline-block;
        width: 23px;
        height: 23px;
        background-size: contain;
    }

    &.rotate-up {
        &:before {
            transform: rotate(-90deg);
        }
    }

    &.rotate-down {
        &:before {
            transform: rotate(90deg);
        }
    }

    @media (max-width: 991px) {
        width: 100%;
        height: 65px;
        border-bottom: 1px solid #404040;

        &:hover {
            text-decoration: none;
            color: white;
        }

        &:first-of-type {
            border-top: 1px solid #404040;
        }

        &:before {
            margin-right: 15px;
        }
    }

    @media (min-width: 992px) {
        margin-left: 25px;

        &:last-of-type {
            margin-right: 15px;
        }

        &:hover {
            color: #8FD6BD;
            text-decoration: none;
        }

        &:before {
            margin-right: 10px;
        }
    }
`

const NavLinks = () => (
    <Container className='nav-links'>
        <NavLink icon={summaryIcon} to='/'><Translate id='link.summary'/></NavLink>
        {!DISABLE_SEND_MONEY &&
            <NavLink icon={arrowIcon} className='rotate-up' to='/send-money'><Translate id='link.send'/></NavLink>
        }
        <NavLink icon={arrowIcon} className='rotate-down' to='/receive-money'><Translate id='link.receive'/></NavLink>
        <NavLink icon={stakingIcon} to='/staking'><Translate id='link.staking'/></NavLink>
    </Container>
)

export default NavLinks;