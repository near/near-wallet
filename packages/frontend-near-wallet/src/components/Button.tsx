import React, { ReactNode } from 'react'
import { styled } from '../styles';

const Button = styled('button', {
    // Reset
    all: 'unset',
    boxSizing: 'border-box',
    userSelect: 'none',
    '&::before': {
        boxSizing: 'border-box',
    },
    '&::after': {
        boxSizing: 'border-box',
    },

    // Custom reset?
    flexShrink: 0,
    lineHeight: '1',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    maxHeight: '56px',
    position: 'relative',

    // Custom
    p: '$4 $6',
    jc: 'center',
    bc: '$white',
    fontSize: '$body1',
    fontWeight: 600,
    width: 'fit-content',
    borderRadius: '$pill',
    cursor: 'pointer',
    transition: '.25s cubic-bezier(.49,.11,.6,1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',


    '&:disabled': {
        boxShadow: 'inset 0 0 0 1px $colors$slate7',
        cursor: "not-allowed",
        pointerEvents: 'none',
    },

    variants: {
        size: {
            'S': {
                fontSize: '$body3',
                p: '$2 $3',
            },
            'M': {
                fontSize: '$body2',
                p: '$3 $4',
            },
            'L': {
                fontSize: '$body1',
            },
            'XL': {
                p: '$5 $6',
                fontSize: '16px',
            },
        },

        variant: {
            primary: {
                bc: '#0072CE',
                color: '$white',
            },
            text: {
                bc: 'transparent',
                color: '$black'
            },
            gray: {
                bc: '$gray',
                color: '$blue'
            }
        },

        loading: {
            true: {
                cursor: 'progress',
                pointerEvents: 'none'
            },
        }
    },

    defaultVariants: {
        size: 'L',
        variant: 'primary',
    },
});


export default Button