import React from 'react';
import { Translate } from 'react-localize-redux';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { Mixpanel } from '../../mixpanel/index';
import HelpIcon from '../svg/HelpIcon';
import UserIcon from '../svg/UserIcon';
import VaultIcon from '../svg/VaultIcon';
import WalletIcon from '../svg/WalletIcon';
import WrapNearIcon from '../svg/WrapNearIcon';

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
            white-space: nowrap;
            &.account-details-link {
                margin-left: 20px;
            }
        }
    }
`;


const NavLinks = ({ items }) => {
    if (items == null) {
        items = getNavLinkItems();
    }
    return (<Container className='nav-links'>
        {items}
    </Container>
    );

};

export const getNavLinkItems = () => {


    return [
        <NavLink key={0} exact to='/' activeClassName='selected' onClick={() => Mixpanel.track("Click Wallet button on nav")}>
            <WalletIcon />
            <Translate id='link.wallet' />
        </NavLink>,
        <NavLink key={1} to='/staking' activeClassName='selected' onClick={() => Mixpanel.track("Click Staking button on nav")}>
            <VaultIcon />
            <Translate id='link.staking' />
        </NavLink>,
        <NavLink key={2} to='/wrap' data-test-id="wrapNearNavLink" activeClassName='selected' onClick={() => Mixpanel.track("Click Staking button on nav")}>
            <WrapNearIcon />
            <Translate id='link.wrap' />
        </NavLink>,
        <NavLink key={3} to='/profile' className='account-details-link' activeClassName='selected' onClick={() => Mixpanel.track("Click Account button on nav")}>
            <UserIcon />
            <Translate id='link.account' />
        </NavLink>,
        <a href='https://nearhelp.zendesk.com/' key={4} target='_blank' rel='noopener noreferrer' onClick={() => Mixpanel.track("Click Help button on nav")}>
            <HelpIcon />
            <Translate id='link.help' />
        </a>
    ];
}

export default NavLinks;