import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import summaryIcon from '../../images/icon-recent.svg';
import arrowIcon from '../../images/icon-send.svg';

const Container = styled.div`
    display: flex;
    align-items: center;
`

const NavLink = styled(Link)`
    display: flex;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-left: 25px;
    cursor: pointer;
    transition: 100ms;
    color: white;

    &:hover {
        color: #8FD6BD;
        text-decoration: none;
    }

    &:before {
        content: '';
        background: url(${props => props.icon});
        background-repeat: no-repeat;
        display: inline-block;
        width: 23px;
        height: 23px;
        margin-right: 10px;

    }

    &:last-of-type {
        &:before {
            transform: rotate(180deg);
        }
    }

`

const NavLinks = () => (
    <Container className='nav-links'>
        <NavLink icon={summaryIcon} to='/'>Summary</NavLink>
        <NavLink icon={arrowIcon} to='/send-money'>Send</NavLink>
        <NavLink icon={arrowIcon} to='/receive-money'>Receive</NavLink>
    </Container>
)

export default NavLinks;