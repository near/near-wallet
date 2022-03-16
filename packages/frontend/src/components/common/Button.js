import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const backgroundColorMap = {
    primary: '#0072CE',
    secondary: '#ffffff',
    destructive: '#FC5B5B'
};
const backgroundColorHoverMap = {
    primary: '#007fe6',
    secondary: '#cccccc',
    destructive: '#FC5B5B'
};
const colorMap = {
    primary: '#FFFFFF',
    secondary: '#888888',
    destructive: '#FFFFFF'
};
const borderColorMap = {
    primary: '#0072CE',
    secondary: '#cccccc',
    destructive: '#FC5B5B'
};
const StyledButton = styled.button`
    border-radius: 40px;
    padding: 5px 32px;
    outline: none;
    font-size: 15px;
    height: 56px;
    font-weight: 600;
    width: ${(props) => props.fullWidth === true ? '100%' : 'auto'};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 150ms ease;
    background-color: ${(props) => backgroundColorMap[props.theme]};
    border: 2px solid ${(props) => borderColorMap[props.theme]};
    color:  ${(props) => colorMap[props.theme]};

    @media (min-width: 768px) {
        &:enabled {
            &:hover {
                background-color: ${(props) => backgroundColorHoverMap[props.theme]};
                color: white;
            }
        }
    }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
`;

const Button = (props) => (
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

Button.propTypes = {
  disabled: PropTypes.bool,
  theme: PropTypes.oneOf(['primary', 'secondary', 'destructive']),
  fullWidth: PropTypes.bool,
};

Button.defaultProps = {
  disabled: false,
  theme: 'primary',
  fullWidth: true,
};

export default Button;
