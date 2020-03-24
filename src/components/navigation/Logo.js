import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from '../../images/wallet.png';

const StyledLogo = styled(Link)`
    background: url(${logo});
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: left center;
    display: block;
    height: 70px;
    background-size: 160px;
    min-width: 52px;
    width: 52px;


    @media (min-width: 900px) {
        background-size: 180px;
        width: 180px;
    }
`

const Logo = () => (
    <StyledLogo to='/' className='logo'/>
)

export default Logo;