import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import AccessAccountBtn from './AccessAccountBtn';
import CreateAccountBtn from './CreateAccountBtn';
import AccountSelector from '../accounts/account_selector/AccountSelector';

const Menu = styled.div`
    position: absolute;
    top: 70px;
    right: 16px;
    border-radius: 8px;
    background-color: white;
    color: #4a4f54;
    width: 320px;
    box-shadow: 0 45px 56px rgba(0, 0, 0, 0.07), 0 10.0513px 12.5083px rgba(0, 0, 0, 0.0417275), 0 2.99255px 3.72406px rgba(0, 0, 0, 0.0282725);
    padding: 16px;

    .user-links {
        padding: 20px;
    }

    button {
        width: 100% !important;
    }
`;

const DesktopMenu = ({
    show,
    accounts,
    handleSelectAccount,
    accountIdLocalStorage,
    accountsBalance,
    refreshBalance,
    onClickCreateNewAccount
}) => {
    if (show) {
        return (
            <Menu id='desktop-menu'>
                <h6><Translate id='link.switchAccount' /></h6>
                <AccountSelector
                    signedInAccountId={accountIdLocalStorage}
                    availableAccounts={accounts}
                    accountsBalances={accountsBalance}
                    getAccountBalance={refreshBalance}
                    onSelectAccount={handleSelectAccount}
                    showBalanceInUSD={true}
                />
                <AccessAccountBtn />
                <CreateAccountBtn onClick={onClickCreateNewAccount}/>
            </Menu>
        );
    }
    return null;
};

export default DesktopMenu;
