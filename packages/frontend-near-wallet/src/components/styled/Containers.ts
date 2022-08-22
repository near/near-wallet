import { styled } from '../../styles';

export const StyledContainer = styled('div', {
    width: 'auto',
    margin: '30px auto 0 auto',
    maxWidth: '100%',
    padding: '0 14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',

    '&.title': {
        fontWeight: 800,
        fontSize: '20px',
        marginTop: '40px',
    }, 

    '& > svg': {
        marginBottom: '16px',
    },


    '& > .logo': {
        maxWidth: '200px',
        width: '100%',
    },

    '& > .ttl': {
        margin: '0 auto 24px',
        textAlign: 'center',
        fontWeight: 800,
    },

    '& > .desc': {
        color: '#72727A'
    },

    '@media(min-width: 768px)': {
        width: '720px',
    },

    '@media(min-width: 992px)': {
        width: '920px',
        padding: '10px 0 10px 0',

    },

    '@media(min-width: 1200px)': {
        width: '1000px',
    },

    '&.small-centered, &.xs-centered': {
        maxWidth: '500px',

        '@media(min-width: 768px)': {
            '&.border': {
                border: '1px solid #F0F0F1',
                borderRadius: '16px',
                padding: '40px',
                marginTop: '40px',
            }
        }
    },

    '&.center': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',

        h2: {
            margin: '10px 0',
        },

        'h1, h2': {
            textAlign: 'center! important',
        }
    },

    '&.xs-centered': {
        maxWidth: '350px !important',
    },

    '&.medium': {
        maxWidth: '600px',
    }
});

export const MigrationContainer = styled('div', {
    display: "flex", 
    alignItems: "center",
    justifyContent: "center",
    height: "100vh"
})