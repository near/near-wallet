import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import NearLogo from '../svg/NearLogo';

const StyledLogo = styled(Link)`
    margin-top: 5px;

    svg {
        width: 155px;
    }

    @media (max-width: 991px) {
        max-width: 44px;
        overflow: hidden;
        margin-left: -10px;
        margin-top: 2px;
        
        svg {
            width: 133px;
        }
    }
`

const Logo = () => (
    <StyledLogo to='/' className='logo'>
        <NearLogo/>
    </StyledLogo>
)

export default Logo;