import React from 'react';
import styled from 'styled-components';

import { COLORS, MEDIA_QUERY } from '../../utils/theme';

const Styles = {
    Container: styled.footer({
        color: COLORS.green,
        backgroundColor: COLORS.darkGray,
        position: 'absolute',
        fontFamily: 'Poppins, sans-serif',
        right: 0,
        left: 0,
        bottom: 0,
        padding: '30px 80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        [MEDIA_QUERY.mobile]: {
            flexDirection: 'column',
            padding: '48px 10px',
            justifyContent: 'center',
        }
    }),
    Logo: styled.span({
        lineHeight: '30px',
        fontWeight: 900,
        fontSize: 40,
    }),
    CommunityButton: styled.div({
        background: COLORS.darkGreen,
        borderRadius: '15px',
        padding: '18px 40px',
        lineHeight: '24px',
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: '18px',

        [MEDIA_QUERY.mobile]: { marginTop: '32px' }
    }),
};

const Footer = () => (
    <Styles.Container>
        <Styles.Logo>
            NEXT.
        </Styles.Logo>
        <Styles.CommunityButton>
            Join Community
        </Styles.CommunityButton>
    </Styles.Container>
);

export default Footer;
