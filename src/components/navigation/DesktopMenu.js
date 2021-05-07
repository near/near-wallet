import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';
import UserAccounts from './UserAccounts';
import CreateAccountBtn from './CreateAccountBtn';
import AccessAccountBtn from './AccessAccountBtn';

const Menu = styled.div`
    position: absolute;
    top: 85px;
    right: 40px;
    border-radius: 4px;
    background-color: white;
    color: #4a4f54;
    width: 320px;
    box-shadow: 0px 3px 9px -1px rgba(0,0,0,0.17);
    padding: 20px;

    :after {
        content: '';
        position: absolute;
        top: -6px;
        right: 25px;
        width: 12px;
        height: 12px;
        background-color: white;
        transform: rotate(-135deg);
        border: 1px solid #eaeaea73;
        border-left: 0;
        border-top: 0;

    }

    .user-links {
        padding: 20px;
    }

    button {
        width: 100% !important;
    }
`

const DesktopMenu = ({ show, accountId, accounts, selectAccount }) => {

    if (show) {
        return (
            <Menu id='desktop-menu'>
                <h6><Translate id='link.switchAccount'/></h6>
                <UserAccounts
                    accounts={accounts}
                    accountId={accountId}
                    selectAccount={selectAccount}
                />
                <AccessAccountBtn/>
                <CreateAccountBtn/>
            </Menu>
        )
    }
    return null;
}

export default DesktopMenu;