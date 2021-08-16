import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import { styled } from '../../stitches.config';

const StyledButton = styled('button', {
  alignItems: 'center',
  appearance: 'none',
  border: 'none',
  borderRadius: '$round',
  color: 'white',
  display: 'flex',
  fontWeight: '$semibold',
  justifyContent: 'center',
  outline: 'none',

  '&:hover': {
    cursor: 'pointer',
  },

  '&:active, &:focus': {
    border: '2px solid $red5',
  },

  '&:disabled': {
    backgroundColor: '$gray6',
    color: '$gray9',
    cursor: 'not-allowed',
  },

  variants: {
    style: {
      primary: {
        backgroundColor: '$blue9',

        '&:hover': {
          backgroundColor: '$blue10',
        },
      },

      secondary: {
        backgroundColor: '$gray5',
        color: '$blue11',

        '&:hover': {
          backgroundColor: '$gray6',
        },
      },

      destructive: {
        backgroundColor: '$gray4',
        color: '$red9',

        '&:hover': {
          backgroundColor: '$gray5',
        },
      },

      danger: {
        backgroundColor: '$red9',

        '&:hover': {
          backgroundColor: '$red10',
        },
      },

      link: {
        backgroundColor: 'transparent',
        color: '$blue10',

        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },

    size: {
      small: {
        height: '$2',
        fontSize: '$small',
        padding: '0 $5',
      },

      regular: {
        height: '$3',
        fontSize: '$body',
        padding: '0 $6',
        minWidth: '140px',
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },

  defaultVariants: {
    style: 'primary',
    size: 'regular',
    fullWidth: 'true',
  },
});

const Button = ({
  label = 'Button',
  disabled = false,
  fullWidth,
  id,
  isLoading,
  onClick,
  size,
  style,
  title,
  type,
  icon,
}) => (
  <StyledButton
    icon={icon}
    label={label}
    disabled={disabled}
    fullWidth={fullWidth}
    id={id}
    isLoading={isLoading}
    onClick={onClick}
    size={size}
    style={style}
    tabIndex='3'
    title={title}
    type={type}
  >
    {icon}
    {/* {isLoading ? <ButtonLoader /> : label} */}
    {label}
  </StyledButton>
);

Button.propTypes = {
  sending: PropTypes.bool,
};

Button.defaultProps = {
  sending: false,
};

export default Button;
