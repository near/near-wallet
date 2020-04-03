import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import accountIcon from '../../images/icon-account.svg';
import arrowAuth from '../../images/icon-authorized.svg';
import iconKeys from '../../images/icon-keys.svg'

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
    font-weight: 500;
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
        <UserLink icon={accountIcon} to={`/profile/${accountId}`}>Profile</UserLink>
        <UserLink icon={arrowAuth} to='/authorized-apps'>Authorized Apps</UserLink>
        <UserLink icon={iconKeys} to='/full-access-keys'>Full Access Keys</UserLink>
    </Container>
)

export default UserLinks;