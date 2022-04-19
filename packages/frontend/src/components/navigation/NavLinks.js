import React from 'react';
import { CREATE_USN_CONTRACT } from '../../../../../features'
import { Translate } from 'react-localize-redux';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
<<<<<<< HEAD
import SwapIconTwoArrows from "../svg/SwapIconTwoArrows";
=======

import { CREATE_USN_CONTRACT } from '../../../../../features';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
import { Mixpanel } from '../../mixpanel/index';
import HelpIcon from '../svg/HelpIcon';
import SwapIconTwoArrows from '../svg/SwapIconTwoArrows';
import UserIcon from '../svg/UserIcon';
import VaultIcon from '../svg/VaultIcon';
import WalletIcon from '../svg/WalletIcon';

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
`;

const NavLinks = () => (
    <Container className='nav-links'>
        <NavLink exact to='/' activeClassName='selected' onClick={() => Mixpanel.track('Click Wallet button on nav')}>
            <WalletIcon/>
            <Translate id='link.wallet'/>
        </NavLink>
        <NavLink data-test-id="staking_navlink" to='/staking' activeClassName='selected' onClick={() => Mixpanel.track('Click Staking button on nav')}>
            <VaultIcon/>
            <Translate id='link.staking'/>
        </NavLink>
        <NavLink to='/profile' className='account-details-link' activeClassName='selected' onClick={() => Mixpanel.track('Click Account button on nav')}>
            <UserIcon/>
            <Translate id='link.account'/>
        </NavLink>
        <a href='https://nearhelp.zendesk.com/' target='_blank' rel='noopener noreferrer' onClick={() => Mixpanel.track('Click Help button on nav')}>
            <HelpIcon/>
            <Translate id='link.help'/>
        </a>
        {CREATE_USN_CONTRACT && 
        <NavLink
            to="/swap-money"
            activeClassName="selected"
<<<<<<< HEAD
            onClick={() => Mixpanel.track("Click Swap button on nav")}
        >
            <div>
                <SwapIconTwoArrows
                    width={"20"}
=======
            onClick={() => Mixpanel.track('Click Swap button on nav')}
        >
            <div>
                <SwapIconTwoArrows
                    width={'20'}
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
                    height="16"
                    color="#A2A2A8"
                    margin="10px"
                />
            </div>

            <Translate id="button.swap" />
        </NavLink>}
    </Container>
);

export default NavLinks;
