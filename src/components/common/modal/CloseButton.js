import React from 'react';
import styled from 'styled-components';

const Container = styled.button`
    border: 0;
    outline: 0;
    cursor: pointer;
    position: absolute;
    padding: 0;
    top: 15px;
    right: 15px;
    min-width: 35px;
    max-width: 35px;
    min-height: 35px;
    max-height: 35px;
    background-color: transparent;

    &.mobile {
        @media (min-width: 650px) {
            display: none;
        }
    }

    &.desktop {
        @media (max-width: 649px) {
            display: none;
        }
    }
    
    .background, .icon {
        transition: 200ms;
    }

    .background {
        opacity: 0;
    }

    :hover {

        .background {
            opacity: 1;    
        }

        .icon {
            stroke: #0072CE;
        }
    }
`

const CloseButton = ({ onClick, device }) => (
    <Container onClick={onClick} title='Close' className={device ? device : ''}>
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className='background' d="M35 17.5C35 27.165 27.165 35 17.5 35C7.83502 35 0 27.165 0 17.5C0 7.83502 7.83502 0 17.5 0C27.165 0 35 7.83502 35 17.5Z" fill="#ECECEC"/>
            <path className='icon' d="M22.9954 11.6817L11.6817 22.9954M11.6817 11.632L22.9954 22.9458" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
    </Container>
)

export default CloseButton;