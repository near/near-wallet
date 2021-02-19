import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import WalletIcon from '../svg/WalletIcon'
import VaultIcon from '../svg/VaultIcon'
import UserIcon from '../svg/UserIcon'
import HelpIcon from '../svg/HelpIcon'

const Container = styled.div`
    display: flex;

    a {
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: 100ms;
        color: #D5D4D8;
        font-size: 15px;

        :hover {
            text-decoration: none;
            color: white;
        }
    }

    svg {
        margin-right: 10px;
        width: 23px;
        height: 23px;

        &.user-icon {
            width: 35px;
            height: 35px;
            margin-right: 4px;
        }
    }

    @media (max-width: 991px) {
        flex-direction: column;
        align-items: flex-start;
    }

    @media (min-width: 992px) {
        align-items: center;
        margin-left: 10px;

        a {
            margin-left: 25px;

            &.account-details-link {
                margin-left: 20px;
            }
        }
    }
`

const NavLinks = () => (
    <Container className='nav-links'>
        <Link to='/'>
            <WalletIcon/>
            <Translate id='link.wallet'/>
        </Link>
        <Link to='/staking'>
            <VaultIcon/>
            <Translate id='link.staking'/>
        </Link>
        <Link to='/profile' className='account-details-link'>
            <UserIcon/>
            <Translate id='link.accountDetails'/>
        </Link>
        <a href='https://nearhelp.zendesk.com/' target='_blank' rel='noopener noreferrer'>
            <HelpIcon/>
            <Translate id='link.help'/>
        </a>
    </Container>
)

export default NavLinks;