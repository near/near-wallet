import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import MyNearWalletLogo from '../svg/MyNearWalletLogo';

const StyledLogo = styled('div')`
    svg {
        width: 170px;
    }

    @media (max-width: 992px) {
        max-width: 44px;

        svg {
            #mynearwallet_logo_text {
                display: none;
            }
        }
    }
`;

const Logo = ({ link, mode }) => (
    <StyledLogo className='logo'>
        {link
            ? <Link to='/'>
                <MyNearWalletLogo mode={mode} />
            </Link>
            : <MyNearWalletLogo mode={mode} />
        }
    </StyledLogo>
);

export default Logo;
