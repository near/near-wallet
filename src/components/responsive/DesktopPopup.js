import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Segment, List, Button, Popup } from 'semantic-ui-react';
import PopupMenuTrigger from './PopupMenuTrigger';
import styled from 'styled-components';

// Images
import AccountImage from '../../images/icon-account.svg';
import AuthorizedGreyImage from '../../images/icon-authorized.svg';
import KeysImage from '../../images/icon-keys.svg';
//import ContactsGreyImage from '../../images/icon-contacts.svg';
//import LogoutImage from '../../images/icon-logout.svg';

const CustomPopup = styled(Popup)`
    &&& {
        padding: 0px;
        left: -50px !important;
        position: fixed !important;
        top: ${props => props.loggedin === 'true' ? "15px !important" : "35px !important"};

        .account-dropdown {
            width: 290px;
            min-height: 100px;
            background-color: #f8f8f8;
            padding: 20px;

            .item {
                color: #999999;
            }

            .submenu {
                margin: -20px -20px 0 -20px;
                padding: 20px;
                background: #fff;

                .icon {
                    width: 20px;
                }

                .content {
                    line-height: 26px;
                    padding-left: 10px;
                }
            
                .item {
                    margin: 4px 0;
                    display: flex;
                }
            }

            .switch-account {
                margin-top: 25px;
                margin-bottom: 0px;
            }

            &-scroll {
                max-height: 226px;
                overflow-y: auto;
                width: 270px;
                margin: 0px;

            > .item {
                width: 250px;
                margin: 0px;
                padding: 0px;

               :hover {
                    text-decoration: underline;
                }

               ::before {
                    display: none;
                }

               ::after {
                    display: none;
                }
            }
         }

        h6 {
            padding-bottom: 6px;
        }
         .account-title {
            height: 40px;
            line-height: 40px;
            color: #4a4f54;
            font-weight: 500;
            border-bottom: 2px solid #e6e6e6;
            letter-spacing: normal;
            text-overflow: ellipsis;
            overflow: hidden;

            &:last-of-type {
                border-bottom: 0;
            }
        }
        button {
            width: 100%;
            border-radius: 30px;
            background: #fff;
            color: #6ad1e3;
            margin: 20px 0 0 0;

            :hover {
                background: #6ad1e3;
                color: #fff;
            }
        }
    }

    :hover {
        .account-dropdown {
            display: block;
        }
    }
}
`;

const DesktopPopup = ({
    account,
    handleSelectAccount,
    availableAccounts,
    redirectCreateAccount,
    handleToggle,
    handleClose,
    handleOpen,
    popupOpen
}) => (
        <CustomPopup
            loggedin={account.accountId ? 'true' : 'false'}
            trigger={
                <PopupMenuTrigger
                    account={account}
                    handleClick={handleToggle}
                    type='desktop'
                />
            }
            position='top right'
            open={popupOpen}
            on='click'
            onClose={handleClose}
            onOpen={handleOpen}
        >
            <Segment basic className='account-dropdown'>
                <List className='submenu'>
                    <List.Item>
                        <List.Icon as={Image} src={AccountImage} />
                        <List.Content as={Link} to='/profile' onClick={handleClose}>
                            Profile
                        </List.Content>
                    </List.Item>
                    {/*
                        <List.Item>
                            <List.Icon as={Image} src={ContactsGreyImage} />
                            <List.Content as={Link} to='/contacts' onClick={handleClose}>
                                Contacts
                            </List.Content>
                        </List.Item>
                    */}
                    <List.Item>
                        <List.Icon as={Image} src={AuthorizedGreyImage} />
                        <List.Content
                            as={Link}
                            to='/authorized-apps'
                            onClick={handleClose}
                        >
                            Authorized Apps
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon as={Image} src={KeysImage} />
                        <List.Content
                            as={Link}
                            to='/full-access-keys'
                            onClick={handleClose}
                        >
                            Full Access Keys
                        </List.Content>
                    </List.Item>
                    {/*
                        <List.Item>
                            <List.Icon as={Image} src={LogoutImage} />
                            <List.Content as={Link} to='/logout' onClick={handleClose}>
                                Logout
                            </List.Content>
                        </List.Item>
                    */}
                </List>
                <List className='switch-account'>
                    <List.Item as='h6'>SWITCH ACCOUNT</List.Item>
                </List>
                <List className='account-dropdown-scroll'>
                    {availableAccounts
                        .filter(a => a !== account.accountId)
                        .map((account, i) => (
                            <List.Item
                                as='a'
                                key={`mf-${i}`}
                                onClick={() => {
                                    handleSelectAccount(account)
                                    handleClose()
                                }
                                }
                                className='account-title'
                            >
                                @{account}
                            </List.Item>
                        ))}
                </List>
                <Button onClick={redirectCreateAccount}>CREATE NEW ACCOUNT</Button>
            </Segment>
        </CustomPopup>
    )

export default DesktopPopup;
