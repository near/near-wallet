import React from 'react';
import styled from 'styled-components';

import { COLORS, MEDIA_QUERY } from '../../utils/theme';

import UserIcon from '../svg/UserIcon';

const Styles = {
    Icon: styled.div({
        width: '64px',
        height: '64px',
        background: COLORS.darkGreen,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '10px',

        '&>svg': {
            width: '30.72px',
            height: '30.72px',
        },
    }),
    Logo: styled.div({
        backgroundPosition: "50%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "64px",
        width: "64px",
        border: "1px",
        borderRadius: "50%",
        marginRight: '10px',
    })
}

const DaoLogo = ({ src }) => {
    if (src) return (<Styles.Logo style={{ backgroundImage: `url(${src})` }} />);

    return (
        <Styles.Icon>
            <UserIcon />
        </Styles.Icon>
    );
};

export default DaoLogo;
