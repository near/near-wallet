import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Button = styled(Link)`
    display: block;
    text-transform: uppercase;
    background-color: #24272A;
    color: #8FD6BD;
    font-weight: 500;
    border-radius: 40px;
    padding: 10px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: normal;
    transition: 100ms;
    letter-spacing: 1px;

    @media (min-width: 769px) {
        background-color: white;
        color: #6AD1E3;
        font-weight: 600;

        :hover {
            color: white;
            background-color: #6AD1E3;
            text-decoration: none;
        }
    }
`

const CreateAccountBtn = () => (
    <Button to='/create'>Create new account</Button>
)

export default CreateAccountBtn;