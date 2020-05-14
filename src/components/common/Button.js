import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    border-radius: 40px;
    padding: 5px;
    text-transform: uppercase;
    font-weight: 500;
    outline: none;
    line-height: normal;
    letter-spacing: 1px;
    font-size: 15px;
    font-family: 'benton-sans',sans-serif;
    height: 48px;
    width: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 150ms ease;
    background-color: ${props => props.theme === 'secondary' ? "#ffffff" : "#0072CE"};
    border: 1px solid ${props => props.theme === 'secondary' ? "#cccccc" : "#0072CE"};
    color: ${props => props.theme === 'secondary' ? "#888888" : "white"};
    
    @media (min-width: 768px) {
        &:enabled {
            &:hover {
                background-color: ${props => props.theme === 'secondary' ? "#cccccc" : "#007fe6"};
                color: white;
            }
        }
    }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
`

const Button = (props) => (
    <StyledButton
        theme={props.theme}
        className={props.className}
        onClick={props.onClick}
        disabled={props.disabled}
        title={props.title}
        type={props.type}
    >
        {props.children}
    </StyledButton>
)

export default Button;