import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import accountIcon from '../../images/icon-account.svg';
import arrowAuth from '../../images/icon-authorized.svg';
import iconKeys from '../../images/icon-keys.svg';
import { Translate } from 'react-localize-redux';
import { ENABLE_FULL_ACCESS_KEYS } from '../../utils/wallet';
import { Mixpanel } from '../../mixpanel/index';

const Container = styled.div`
    display: flex;
    flex-direction: column;
`

const UserLink = styled(Link)`
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: 100ms;
    padding: 8px 0;
    color: #8FD6BD;
    transition: 100ms;

    :hover {
        text-decoration: none;
    }

    @media (max-width: 991px) {
        &:hover {
            color: #8FD6BD;
        }
    }

    @media (min-width: 992px) {
        color: #0072CE;

        :hover {
            color: #999;
        }
    }

    &:before {
        content: '';
        background: url(${props => props.icon});
        background-repeat: no-repeat;
        background-size: 100%;
        display: inline-block;
        width: 23px;
        height: 23px;
        margin-right: 12px;

    }
`

const UserLinks = ({ accountId }) => (
    <Container className='user-links'>
        <UserLink icon={accountIcon} to='/profile' onClick={() => Mixpanel.track("Click profile button")}><Translate id='link.accountDetails'/></UserLink>
        <UserLink icon={arrowAuth} to='/authorized-apps' onClick={() => Mixpanel.track("Click authorized apps button")}><Translate id='link.authorizedApps'/></UserLink>
        {ENABLE_FULL_ACCESS_KEYS && <UserLink icon={iconKeys} to='/full-access-keys' onClick={() => Mixpanel.track("Click full access keys button")}><Translate id='link.fullAccessKeys'/></UserLink>}
    </Container>
)

export default UserLinks;