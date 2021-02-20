import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import WalletIcon from '../svg/WalletIcon'
import VaultIcon from '../svg/VaultIcon'
import UserIcon from '../svg/UserIcon'
import HelpIcon from '../svg/HelpIcon'
import { Mixpanel } from '../../mixpanel/index';

const Container = styled.div`
    display: flex;
    a {
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: 100ms;
        color: #72727A;
        font-size: 15px;

        :hover, &.selected {
            text-decoration: none;
            color: #272729;

            svg {
                path, circle, line {
                    stroke: #0072CE;
                }

                &.user-icon {
                    path {
                        stroke: #0072CE;
                        fill: #0072CE;

                        :last-of-type {
                            fill: none;
                        }
                    }
                }
            }
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
            stroke-width: 0px;
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
        <NavLink exact to='/' activeClassName='selected' onClick={() => Mixpanel.track("Click summary button on nav")}>
            <WalletIcon/>
            <Translate id='link.wallet'/>
        </NavLink>
        <NavLink to='/staking' activeClassName='selected' onClick={() => Mixpanel.track("STAKE Click staking button on nav")}>
            <VaultIcon/>
            <Translate id='link.staking'/>
        </NavLink>
        <NavLink to='/profile' className='account-details-link' activeClassName='selected'>
            <UserIcon/>
            <Translate id='link.account'/>
        </NavLink>
        <a href='https://nearhelp.zendesk.com/' target='_blank' rel='noopener noreferrer'>
            <HelpIcon/>
            <Translate id='link.help'/>
        </a>
    </Container>
)

export default NavLinks;