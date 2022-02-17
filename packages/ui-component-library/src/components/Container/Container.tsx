import { styled } from '../../styles'


const Container = styled('div', {
    // Reset
    boxSizing: 'border-box',
    flexShrink: 0,

    // Custom
    ml: 'auto',
    mr: 'auto',
    px: '120px',

    '@bp1': {
        maxWidth: '430px',
    },

    variants: {
        size: {
            '1': {
                maxWidth: '430px',
            },
            '2': {
                maxWidth: '715px',
            },
            '3': {
                maxWidth: '1145px',
            },
            '4': {
                maxWidth: 'none',
            },
        },
    },
    defaultVariants: {
        size: '4',
    },
});

export default Container