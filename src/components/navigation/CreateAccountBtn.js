import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';

const Button = styled(Link)`
    display: block;
    text-transform: uppercase;
    background-color: #24272A;
    color: #8FD6BD;
    border-radius: 40px;
    padding: 10px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 100ms;
    letter-spacing: 1px;
    font-weight: 500;

    &:hover {
        text-decoration: none;
        color: #8FD6BD;
    }

    @media (min-width: 992px) {
        background-color: white;
        color: #6AD1E3;

        :hover {
            color: white;
            background-color: #6AD1E3;
            text-decoration: none;
        }
    }
`

const CreateAccountBtn = () => (
    <Button to='/create'>
        <Translate id='button.createNewAccount'/>
    </Button>
)

export default CreateAccountBtn;