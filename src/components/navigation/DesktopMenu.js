import React from 'react';
import styled from 'styled-components';
import UserLinks from './UserLinks';
import UserAccounts from './UserAccounts';
import CreateAccountBtn from './CreateAccountBtn';

const Menu = styled.div`
    position: absolute;
    top: 85px;
    right: 40px;
    border-radius: 4px;
    background-color: white;
    color: #4a4f54;
    width: 290px;
    box-shadow: 0px 3px 9px -1px rgba(0,0,0,0.17);

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

    h6 {
        text-transform: uppercase;
        font-size: 13px !important;
    }
`

const LowerSection = styled.div`
    padding: 20px;
    background-color: #f8f8f8;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
`

const DesktopMenu = ({ show, accountId, accounts, selectAccount, toggleMenu }) => {

    if (show) {
        return (
            <Menu id='desktop-menu'>
                <UserLinks accountId={accountId}/>
                <LowerSection>
                    <h6>Switch Account</h6>
                    <UserAccounts
                        accounts={accounts}
                        accountId={accountId}
                        selectAccount={selectAccount}
                    />
                    <CreateAccountBtn/>
                </LowerSection>
            </Menu>
        )
    }
    return null;
}

export default DesktopMenu;