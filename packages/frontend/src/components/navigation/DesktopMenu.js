import React, { useEffect, useState } from "react";
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import AccessAccountBtn from './AccessAccountBtn';
import CreateAccountBtn from './CreateAccountBtn';
import UserAccounts from './UserAccounts';

const Menu = styled.div`
    position: absolute;
    top: 70px;
    right: 16px;
    border-radius: 8px;
    background-color: white;
    color: #4a4f54;
    width: 320px;
    box-shadow: 0px 45px 56px rgba(0, 0, 0, 0.07), 0px 10.0513px 12.5083px rgba(0, 0, 0, 0.0417275), 0px 2.99255px 3.72406px rgba(0, 0, 0, 0.0282725);
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
    accountId,
    accounts,
    handleSelectAccount,
    accountIdLocalStorage,
    accountsBalance,
    balance,
    refreshBalance,
    getBalance,
    isInactiveAccount
}) => {
    const [filteredAvailableAccounts, setFilteredAvailableAccounts] = useState(
        accounts
    );
    const [currentFilter, setCurrentFilter] = useState("");

    useEffect(() => {
        if (accounts.length > 0) {
            setFilteredAvailableAccounts(accounts);
        }
    }, [accounts]);

    useEffect(() => {
        setFilteredAvailableAccounts(
            accounts.filter(
                (f) => f.includes(currentFilter) || currentFilter === ""
            )
        );
    }, [currentFilter]);
    if (show) {
        return (
            <Menu id='desktop-menu'>
                <h6><Translate id='link.switchAccount'/></h6>
                <UserAccounts
                    accounts={filteredAvailableAccounts}
                    accountId={accountId}
                    accountIdLocalStorage={accountIdLocalStorage}
                    handleSelectAccount={handleSelectAccount}
                    accountsBalance={accountsBalance}
                    balance={balance}
                    refreshBalance={refreshBalance}
                    getBalance={getBalance}
                />
                <input
                    id="filter"
                    name="filter"
                    type="text"
                    placeholder={'Search For Accounts'}
                    value={currentFilter}
                    onChange={(event) =>
                        setCurrentFilter(event.target.value)
                    }
                />
                <AccessAccountBtn/>
                {!isInactiveAccount &&
                    <CreateAccountBtn/>
                }
            </Menu>
        );
    }
    return null;
};

export default DesktopMenu;
