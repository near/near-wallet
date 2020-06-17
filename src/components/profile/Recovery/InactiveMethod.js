import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';

const NotEnabledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    color: #24272a;
`

const Button = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background-color: #0072ce;
    text-transform: uppercase;
    border-radius: 40px;
    transition: 150ms;

    :hover {
        background-color: rgb(0, 127, 230);
        color: white;
        text-decoration: none;
    }
`

const InactiveMethod = ({ method, accountId }) => (
    <NotEnabledContainer>
        <Translate id={`recoveryMgmt.methodTitle.${method}`}/>
        <Button to={{
            pathname: `${method !== 'phrase' ? '/set-recovery/' : '/setup-seed-phrase/'}${accountId}`,
            method: method
        }}>
            <Translate id='button.enable'/>
        </Button>
    </NotEnabledContainer>
);

export default InactiveMethod;