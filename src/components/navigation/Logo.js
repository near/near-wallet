import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import NearLogo from '../svg/NearLogo';

const StyledLogo = styled(Link)`
    margin-top: 5px;

    @media (max-width: 991px) {
        max-width: 53px;
        overflow: hidden;
        margin-left: -10px;
        margin-top: 2px;
    }

    svg {
        width: 155px;
    }
`

const Logo = () => (
    <StyledLogo to='/' className='logo'>
        <NearLogo/>
    </StyledLogo>
)

export default Logo;