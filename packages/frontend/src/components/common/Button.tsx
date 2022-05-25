import PropTypes from 'prop-types';
import React from 'react';
import { ReactNode } from 'react';
import styled from 'styled-components';

type ButtonProps = {
    className?: string;
    onClick: ()=> void;
    title?: string;
    type?: "button" | "submit" | "reset";
    children?: ReactNode;
    disabled?: boolean;
    theme?: 'primary' | 'secondary';
    fullWidth?: boolean;
}

const StyledButton = styled.button`
    border-radius: 40px;
    padding: 5px 32px;
    outline: none;
    font-size: 15px;
    height: 56px;
    font-weight: 600;
    width: ${(props:ButtonProps) => props.fullWidth === true ? '100%' : 'auto'};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 150ms ease;
    background-color: ${(props:ButtonProps) => props.theme === 'secondary' ? '#ffffff' : '#0072CE'};
    border: 2px solid ${(props:ButtonProps) => props.theme === 'secondary' ? '#cccccc' : '#0072CE'};
    color: ${(props:ButtonProps) => props.theme === 'secondary' ? '#888888' : 'white'};

    @media (min-width: 768px) {
        &:enabled {
            &:hover {
                background-color: ${(props:ButtonProps) => props.theme === 'secondary' ? '#cccccc' : '#007fe6'};
                color: white;
            }
        }
    }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
`;



const Button = (props:ButtonProps) => (
    <StyledButton
        theme={props.theme}
        className={props.className}
        onClick={props.onClick}
        disabled={props.disabled}
        title={props.title}
        type={props.type}
        fullWidth={props.fullWidth}
    >
        {props.children}
    </StyledButton>
);

Button.defaultProps = {
  disabled: false,
  theme: 'primary',
  fullWidth: true,
};

export default Button;
