import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    border-radius: 40px;
    padding: 5px 32px;
    outline: none;
    font-size: 15px;
    height: 56px;
    font-weight: 600;
    // @ts-ignore
    width: ${(props:any) => props.fullWidth === true ? '100%' : 'auto'};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 150ms ease;
    background-color: ${props => props.theme === 'secondary' ? '#ffffff' : '#0072CE'};
    border: 2px solid ${props => props.theme === 'secondary' ? '#cccccc' : '#0072CE'};
    color: ${props => props.theme === 'secondary' ? '#888888' : 'white'};

    @media (min-width: 768px) {
        &:enabled {
            &:hover {
                background-color: ${props => props.theme === 'secondary' ? '#cccccc' : '#007fe6'};
                color: white;
            }
        }
    }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
`;

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
}

export interface ButtonProps extends ButtonHTMLAttributes<any>{
  className?:string;
  title:string;
  theme?: ButtonVariant;
  onClick?: ()=>void;
  disabled ?:boolean;
  fullWidth?: boolean;
}

const Button:React.FC<ButtonProps> = (props) => (
  <StyledButton
    theme={props.theme}
    className={props.className}
    onClick={props.onClick}
    disabled={props.disabled}
    title={props.title}
    type={props.type}
    // @ts-ignore
    fullWidth={props.fullWidth}
  >
    {props.children}
  </StyledButton>
);

Button.defaultProps = {
  disabled: false,
  theme: ButtonVariant.Primary,
  type: 'button',
  fullWidth: true
};

export default Button;
