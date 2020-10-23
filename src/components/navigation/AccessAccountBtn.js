import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';

const Button = styled(Link)`
    display: block;
    text-transform: uppercase;
    background-color: transparent;
    color: #0072CE; 
    border-radius: 40px;
    padding: 10px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: normal;
    transition: 100ms;
    letter-spacing: 1px;
    font-weight: 500;

    &:hover {
        text-decoration: none;
        color: #0072CE;
    }

    @media (min-width: 992px) {
        background-color: white;
        color: #0072CE;

        :hover {
            color: white;
            background-color: #0072CE;
            text-decoration: none;
        }
    }
`

const AccessAccountBtn = () => (
    <Button to='/recover-account'>
        <Translate id='button.addAccount'/>
    </Button>
)

export default AccessAccountBtn;