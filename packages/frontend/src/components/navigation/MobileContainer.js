import React, { Component } from 'react';
import {Translate} from 'react-localize-redux';
import styled from 'styled-components';

import DeprecatedLogo from './DeprecatedLogo';
import Logo from './Logo';
import { isWhitelabel } from '../../config/whitelabel';
import FormButton from '../common/FormButton';

const Container = styled.div`
    display: none;
    color: white;
    font-size: 15px;
    margin-bottom: 20px;
    background-color: white;
    height: 70px;
    position: relative;
    padding: 0 14px;
    border-bottom: 1px solid #F0F0F1;
    transition: 300ms;
    & button {
     max-width: 200px;   
    }
    ::-webkit-scrollbar {
        display: none;
    }

    @media (max-width: 991px) {
        display: block;
    }

    .user-links {
        margin-top: 15px;

        a {
            padding: 10px 0;
        }
    }

    &.show {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .user-name {
        max-width: 200px;
        white-space: nowrap;
    }

    .nav-links {
        margin: 0 -14px;
        background-color: #FAFAFA;
        a {
            padding: 17px 14px;
            border-top: 1px solid #efefef;
            width: 100%;
            max-height: 58px;

            svg {
                margin-right: 15px;
            }

            .user-icon {
                margin-left: -7px;
                margin-right: 10px;
            }
        }
    }
`;

const Collapsed = styled.div`
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .user-account {
        padding: 4px 5px 4px 4px;
    }

    .user-icon {
        .background {
            fill: #E5E5E6;
        }
    }
`;


class MobileContainer extends Component {
    render() {

        const {
            menuOpen,
            showNavLinks,
            flowLimitationMainMenu,
        } = this.props;

        return (
            <Container className={menuOpen ? 'show' : ''} id='mobile-menu'>
                <Collapsed>
                    {
                        isWhitelabel ?
                            <Logo link={!flowLimitationMainMenu} mode='mobile' /> :
                            <DeprecatedLogo link={!flowLimitationMainMenu}/>
                    }
                    {showNavLinks && (
                        <FormButton
                            className='dark-gray-black'
                            color='dark-gray-black'
                            trackingId="Click create account button"
                            data-test-id="landingPageCreateAccount"
                        >
                            <Translate id="button.transferAccounts" />
                        </FormButton>
                    )}
                </Collapsed>
            </Container>
        );
    }
}

export default MobileContainer;
