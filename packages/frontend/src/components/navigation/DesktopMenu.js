import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';
import NavLinks from './NavLinks';

import AccountSelector from '../accounts/account_selector/AccountSelector';
import AccessAccountBtn from './AccessAccountBtn';
import CreateAccountBtn from './CreateAccountBtn';

const Menu = styled.div`
    position: absolute;
    top: 70px;
    right: 16px;
    border-radius: 8px;
    background-color: white;
    color: #4a4f54;
    width: 320px;
    box-shadow: 0px 45px 56px rgba(0, 0, 0, 0.07), 0px 10.0513px 12.5083px rgba(0, 0, 0, 0.0417275), 0px 2.99255px 3.72406px rgba(0, 0, 0, 0.0282725);
    padding: 0px 16px 16px 16px;

    .user-links {
        padding: 20px;
    }

    button {
        width: 100% !important;
    }

    .nav-links {
        margin: 0 -16px;
        background-color: #FAFAFA;
        flex-direction: column;

        a {
            padding: 17px 14px;
            border-top: 1px solid #efefef;
            width: 100%;
            max-height: 58px;
            margin-left: 0px !important;

            svg {
                margin-right: 15px;
            }

            .user-icon {
                margin-left: -7px;
                margin-right: 10px;
            }
        }

        a:last-child{
            border-bottom: 1px solid #efefef;
        }
    }
`;
const LowerSection = styled.div`
    padding-top: 16px;
`;

const MinorNavLinkContainer = styled.div`
    display: block;
`
const DesktopMenu = ({
    show,
    accounts,
    handleSelectAccount,
    accountIdLocalStorage,
    accountsBalance,
    refreshBalance,
    isInactiveAccount,
    minorNavLinkItems
}) => {
    if (show) {
        const minorNavItemContainer = minorNavLinkItems.length > 0 ? (
            <MinorNavLinkContainer>
                <NavLinks items={minorNavLinkItems} />
            </MinorNavLinkContainer>
        ) : null;
        return (
            <Menu id='desktop-menu'>
                {!isInactiveAccount &&
                    minorNavItemContainer
                }

                <LowerSection>
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
                    {!isInactiveAccount &&
                        <CreateAccountBtn />
                    }
                </LowerSection>
            </Menu>
        );
    }
    return null;
};

export default DesktopMenu;
