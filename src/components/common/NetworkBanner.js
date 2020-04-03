import React from 'react';
import styled from 'styled-components';
import helpIcon from '../../images/icon-help-white.svg';
import { NETWORK_ID, IS_MAINNET } from '../../utils/wallet';
import { Modal } from 'semantic-ui-react';
import Button from './Button';

const Container = styled.div`
    color: white;
    position: fixed;
    height: 35px;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
        padding: 0;
        height: 100%;
        line-height: normal;
        border-radius: 0;
        text-transform: initial;
        letter-spacing: 0.5px;

        :hover {
            background-color: #0072CE !important;
        }

        :after {
            content: '';
            background: url(${helpIcon}) center no-repeat;
            height: 18px;
            width: 18px;
            margin: 0 0 0 6px;
        }
    }
`

const Header = styled.h4`
    margin-bottom: 5px !important;
`

const Name = styled.span`
    text-transform: capitalize;
`

const NetworkBanner = () => {
    if (!IS_MAINNET) {
        return (
            <Container>
                <Modal 
                    size='mini'
                    trigger={<Button>You are using NEAR&nbsp;<Name>{NETWORK_ID}</Name></Button>}
                    closeIcon
                >
                    <Header>What is NEAR <Name>{NETWORK_ID}</Name>?</Header>
                    <Name>{NETWORK_ID}</Name> is for testing purposes only. Tokens and other assets have no value. Accounts created on <Name>{NETWORK_ID}</Name> do not transfer to Mainnet.
                </Modal>
            </Container>
        )
    }
    return null
}

export default NetworkBanner;