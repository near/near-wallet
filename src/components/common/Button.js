import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledButton = styled.button`
    border-radius: 40px;
    padding: 5px 32px;
    text-transform: uppercase;
    outline: none;
    letter-spacing: 1px;
    font-size: 15px;
    height: 48px;
    width: ${props => props.fullWidth === true ? "100%" : "auto"};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 150ms ease;
    background-color: ${props => props.theme === 'secondary' ? "#ffffff" : "#0072CE"};
    border: 2px solid ${props => props.theme === 'secondary' ? "#cccccc" : "#0072CE"};
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
        fullWidth={props.fullWidth}
    >
        {props.children}
    </StyledButton>
)

Button.propTypes = {
  disabled: PropTypes.bool,
  theme: PropTypes.oneOf(['primary', 'secondary']),
  fullWidth: PropTypes.bool,
};

Button.defaultProps = {
  disabled: false,
  theme: 'primary',
  fullWidth: true,
}

export default Button;