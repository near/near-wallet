import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import summaryIcon from '../../images/icon-recent.svg';
import arrowIcon from '../../images/icon-send.svg';
import stakingIcon from '../../images/icon-staking-green.svg';
import { Translate } from 'react-localize-redux';

const Container = styled.div`
    display: flex;

    @media (max-width: 991px) {
        flex-direction: column;
        align-items: flex-start;
    }

    @media (min-width: 992x) {
        align-items: center;
    }

    a {
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: 100ms;
        color: #D5D4D8;

        :hover {
            text-decoration: none;
            color: white;
        }
    }
`

const NavLinks = () => (
    <Container className='nav-links'>
        <Link to='/'>
            <Translate id='link.wallet'/>
        </Link>
        <Link to='/staking'>
            <Translate id='link.staking'/>
        </Link>
        <Link to='/send-money'>
            <Translate id='link.accountDetails'/>
        </Link>
        <Link to='/receive-money'>
            <Translate id='link.help'/>
        </Link>
    </Container>
)

export default NavLinks;