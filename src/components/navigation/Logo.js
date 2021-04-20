import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import NearLogo from '../svg/NearLogo';

const StyledLogo = styled(`div`)`
    margin-top: 5px;

    svg {
        width: 155px;

        path {
            fill: black !important;
        }
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

const Logo = ({ link }) => (
    <StyledLogo className='logo'>
        {link
            ? <Link to='/'>
                <NearLogo />
            </Link>
            : <NearLogo />
        }
    </StyledLogo>
)

export default Logo
