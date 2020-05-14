import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from '../../images/wallet.svg';

const StyledLogo = styled(Link)`
    background: url(${logo});
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: left center;
    display: block;
    height: 70px;
    background-size: 130px;
    min-width: 39px;
    width: 39px;


    @media (min-width: 900px) {
        background-size: 155px;
        width: 155px;
    }
`

const Logo = () => (
    <StyledLogo to='/' className='logo'/>
)

export default Logo;