import React from 'react';
import styled from 'styled-components';

import { COLORS, MEDIA_QUERY } from '../../utils/theme';
import FormButton from '../common/FormButton';
import DaoCard from './DaoCard';
import { useDao } from './hooks';

const Styles = {
    Container: styled.div({
        maxWidth: '1280px',
        margin: '30px auto 0 auto',
        padding: '10px 0 10px 0'
    }),
    NotFound: styled.div({
        maxWidth: '1280px',
        margin: '30px auto 0 auto',
        padding: '10px 0 10px 0',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 350px)',
        '&>button': {
            width: '670px',
            background: `${COLORS.darkGreen} !important`,
            borderRadius: '15px !important',
            fontFamily: 'Poppins',
            fontWeight: '500 !important',
            fontSize: '32px !important',
            color: `${COLORS.green} !important`,
            marginTop: '60px !important',
            border: 'unset !important',
            [MEDIA_QUERY.tablet]: {
                borderRadius: '30px !important',
                width: 'calc(100% - 60px) !important',
                fontWeight: '500 !important',
                fontSize: '18px !important',
                marginLeft: '30px !important',
                marginRight: '30px !important',
                maxWidth: '300px',
            },
        },
        '&>button:hover': {
            background: `${COLORS.green} !important`,
            color: `${COLORS.black} !important`,
        },
    }),
    Text: styled.div({
        fontFamily: 'Poppins',
        fontWeight: 700,
        fontSize: '40px',
        color: COLORS.beige,
        textAlign: 'center',
        [MEDIA_QUERY.tablet]: {
            fontWeight: 600,
            fontSize: '24px',
        },
    }),
};

export const Dao = () => {
    const {data} = useDao();

    return data !== null ? data.length ? ( 
        <Styles.Container>
            {data.map((item) => (
                <DaoCard key={item.id} {...item} />
            ))}
        </Styles.Container> 
    ) : (
        <Styles.NotFound>
            <Styles.Text>Looks like you don't have any DAO’s.</Styles.Text>
            <FormButton
                linkTo='https://testnet.app.astrodao.com/create-dao-new?step=info'
                trackingId='Click to account on explorer'
            >
                Create new DAO
            </FormButton>
        </Styles.NotFound>
    ) : null;
};
