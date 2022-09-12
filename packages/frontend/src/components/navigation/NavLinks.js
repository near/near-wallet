import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { COLORS } from '../../utils/theme';
import AccountIcon from '../svg/AccountIcon';
import DaoIcon from '../svg/DaoIcon';
import ReportsIcon from '../svg/ReportsIcon';
import WalletIcon from '../svg/WalletIcon';


const Container = styled.div`
    display: flex;
    a {
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: 100ms;
        color: ${COLORS.lightText};
        font-size: 18px;
        line-height: 24px;
        white-space: nowrap;

        :hover, &.selected {
            text-decoration: none;
            color: ${COLORS.green};

            svg {
                path, circle, line, rect {
                    stroke: ${COLORS.green};
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

    .usn-button {
        margin-left: auto;
        margin-right: 20px;
        height: 35px;
        padding: 5px 15px 5px 5px;
        border-radius: 20px;
        background: #D6EDFF;
        font-weight: 600;
        color: black;
        white-space: nowrap;

        :hover {
            background: #0072CE;
            color: white;
        }

        img {
            margin-right: 10px;
            margin-top: 2px;
            width: 25px;
            height: 25px;
        }
    }

    @media (max-width: 991px) {
        flex-direction: column;
        align-items: flex-start;
    }

    @media (min-width: 992px) {
        align-items: center;
        margin-left: auto;

        a {
            margin-right: 50px;

            &.account-details-link {
                margin-left: 20px;
            }
        }
    }
`;

const NavLinks = () => (
    <Container className='nav-links'>
        <NavLink exact to='/' activeClassName='selected'>
            <WalletIcon />
            Wallet
        </NavLink>
        <NavLink data-test-id="staking_navlink" to='/dao' activeClassName='selected'>
            <DaoIcon />
            DAO
        </NavLink>
        <NavLink to='/profile' className='account-details-link' activeClassName='selected'>
            <AccountIcon />
            Account
        </NavLink>
        <NavLink to='/reports' className='account-details-link' activeClassName='selected'>
            <ReportsIcon />
            Reports
        </NavLink>
    </Container>
);

export default NavLinks;
