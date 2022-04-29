import React from 'react';
import styled from 'styled-components';

import { IS_MAINNET} from '../../config';
import USN_LOGO from '../../images/USN_LOGO.png'
import OPEN_LINK from '../../images/open-link.svg'

const Container = styled.div`
    color: white;
    background-color: lightblue;
    position: fixed;
    padding: 6px;
    top: ${({IS_MAINNET}) => (IS_MAINNET ? 0 : '38px')};
    left: 0;
    right: 0;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    > img {
        width: 26px;
        height: 26px;
        margin-right: 5px;
    }
    .open-link {
        width: 17px;
        height: 17px
    }

    .text {
        color: black;
        font-weight: 600;
    }

    .network-link {
        margin-left: 10px;
      
    }

    a {
        color: black;
        font-weight: 600;
        text-decoration: underline;
        margin-right: 10px
    }
`;

export const NetworkUSNBanner = () => {  
        return (
            <Container id='usn-banner' IS_MAINNET={IS_MAINNET}>
                {/* <Translate id='networkBanner.title' /> */}
                <img src={USN_LOGO} alt='USN_LOGO'/>
                <span className='text'>$USN Released !</span>
                <span className='network-link'>
                    <a href={!IS_MAINNET 
                            ? 'https://swap.testnet.decentral-bank.finance/'
                            : 'https://swap.decentral-bank.finance/'
                         } 
                        target='_blank' 
                        rel='noopener noreferrer'>
                       Buy $USN
                    </a>
                </span>
                {/* <Tooltip translate='networkBanner.desc' modalOnly={true}/> */}
                <img src={OPEN_LINK} alt='OPEN_LINK' className='open-link'/>
            </Container>
        );
};

