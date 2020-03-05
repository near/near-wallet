import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from '../../images/wallet.png';

const StyledLogo = styled(Link)`
    width: 60px;
    background: url(${logo});
    background-size: 180px;
    background-repeat: no-repeat;
    height: 70px;

    @media (min-width: 992px) {
        width: 180px;
    }
`

const Logo = () => (
    <StyledLogo to='/'/>
)

export default Logo;