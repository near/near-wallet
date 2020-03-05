import React, { Component } from 'react';
import styled from 'styled-components';
import logo from '../../images/wallet.png';
import summaryIcon from '../../images/icon-recent.svg';
import arrowIcon from '../../images/icon-send.svg';
import helpIcon from '../../images/icon-help.svg';

const Container = styled.div`
    display: none;
    color: white;
    box-shadow: 0px 5px 9px -1px rgba(0,0,0,0.17);

    @media (min-width: 769px) {
        display: flex;
    }

    font-family: 'benton-sans',sans-serif;
    background-color: #24272a;
    position: sticky;
    height: 70px;
    top: 0;
    z-index: 1000;
    align-items: center;

    img {
        width: 180px;
    }
`

const NavLink = styled.div`
    display: flex;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-left: 25px;
    cursor: pointer;
    transition: 100ms;

    &:hover {
        color: #8FD6BD;
    }

    &:before {
        content: '';
        background: url(${props => props.icon});
        background-repeat: no-repeat;
        display: inline-block;
        width: 23px;
        height: 23px;
        margin-right: 10px;

    }

    &:last-of-type {
        &:before {
            transform: rotate(180deg);
        }
    }

`

const Help = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
    text-transform: uppercase;
    cursor: pointer;

    &:before {
        content: '';
        background: url(${helpIcon});
        background-repeat: no-repeat;
        display: inline-block;
        width: 23px;
        height: 23px;
        margin-right: 10px;
    }
`

const User = styled.div`
    border-left: 2px solid #5d5f60;
    position: relative;
    min-width: 150px;
    max-width: 160px;
    margin-left: 20px;
    padding: 0 50px 0 20px;
    font-size: 15px;
    cursor: pointer;
    user-select: none;

    &:after {
        content: '';
        border-color: #f8f8f8;
        border-style: solid;
        border-width: 1px 1px 0 0;
        display: inline-block;
        position: absolute;
        right: 25px;
        top: calc(50% - 10px);
        transform: rotate(135deg) translateY(-50%);
        height: 9px;
        width: 9px;
    }
`

const Username = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
`

const Balance = styled.div`
    color: #8FD6BD;
    margin-top: 3px;
`

class DesktopContainer extends Component {
    render() {
        return (
            <Container>
                <img src={logo} alt='NEAR logo'/>
                <NavLink icon={summaryIcon}>Summary</NavLink>
                <NavLink icon={arrowIcon}>Send</NavLink>
                <NavLink icon={arrowIcon}>Receive</NavLink>
                <Help>Help</Help>
                <User>
                    <Username>@patricadasdasdak</Username>
                    <Balance>10.3 Ⓝ</Balance>
                </User>
            </Container>
        )
    }
}

export default DesktopContainer;