import React from 'react';
import styled from 'styled-components';

import { COLORS, MEDIA_QUERY } from '../../utils/theme';
import OutIcon from '../svg/OutIcon';

const Styles = {
    Container: styled.div({
        background: COLORS.darkGray,
        padding: '15px 30px',
        fontFamily: '\'Poppins\', sans-serif',
        lineHeight: '175.4%',
        borderRadius: '30px',
        marginTop: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(25%, 1fr))',
        [MEDIA_QUERY.mobile]: {
            gridTemplateColumns: 'repeat(3, minmax(33%, 1fr))',
            padding: '15px 15px',
        },
    }),
    Line: styled.div(({ textAlign = 'center' }) => ({
        border: '1px solid rgba(165, 165, 165, 0.5)',
        margin: '15px 0px',
        gridColumnStart: 1,
        gridColumnEnd: 5,
        gridRowStart: 2,
        gridRowEnd: 3,
        [MEDIA_QUERY.mobile]: {
            display: 'none',
        },
    })),
    Title: styled.div(({ textAlign = 'center' }) => ({
        fontWeight: '500',
        fontSize: '20px',
        color: COLORS.lightText,
        textAlign,
        marginBottom: '15px',
        [MEDIA_QUERY.mobile]: {
            fontSize: '14px',
        },
    })),
    Value: styled.div(({ colorText = 'beige' }) => ({
        fontWeight: '700',
        fontSize: '22px',
        color: COLORS[colorText],
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        [MEDIA_QUERY.mobile]: {
            fontSize: '22px',
        },
    })),
    TypeWrapper: styled.div({
        gridColumnStart: 1,
        gridColumnEnd: 2,
        gridRowStart: 1,
        gridRowEnd: 2,
        [MEDIA_QUERY.mobile]: {
            gridColumnStart: 1,
            gridColumnEnd: 2,
            gridRowStart: 1,
            gridRowEnd: 2,
            borderBottom: '1px solid rgba(165, 165, 165, 0.5)',
            paddingBottom: '15px',
        },
    }),
    ProposerWrapper: styled.div({
        gridColumnStart: 2,
        gridColumnEnd: 3,
        gridRowStart: 1,
        gridRowEnd: 1,
        [MEDIA_QUERY.mobile]: {
            gridColumnStart: 1,
            gridColumnEnd: 4,
            gridRowStart: 2,
            gridRowEnd: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            borderBottom: '1px solid rgba(165, 165, 165, 0.5)',
            paddingBottom: '15px',
            paddingTop: '15px',
        },
    }),
    DescriptionWrapper: styled.div({
        gridColumnStart: 3,
        gridColumnEnd: 4,
        gridRowStart: 1,
        gridRowEnd: 2,
        [MEDIA_QUERY.mobile]: {
            gridColumnStart: 2,
            gridColumnEnd: 4,
            gridRowStart: 1,
            gridRowEnd: 2,
            borderBottom: '1px solid rgba(165, 165, 165, 0.5)',
            paddingBottom: '15px',
            '&>div': {
                textAlign: 'end',
            },
        },
    }),
    TimeWrapper: styled.div({
        gridColumnStart: 4,
        gridColumnEnd: 5,
        gridRowStart: 1,
        gridRowEnd: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        [MEDIA_QUERY.mobile]: {
            gridColumnStart: 1,
            gridColumnEnd: 3,
            gridRowStart: 4,
            gridRowEnd: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            paddingTop: '15px',
        },
    }),
    AmountWrapper: styled.div({
        gridColumnStart: 1,
        gridColumnEnd: 2,
        gridRowStart: 3,
        gridRowEnd: 4,
        [MEDIA_QUERY.mobile]: {
            gridColumnStart: 3,
            gridColumnEnd: 4,
            gridRowStart: 3,
            gridRowEnd: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            borderBottom: '1px solid rgba(165, 165, 165, 0.5)',
            paddingBottom: '15px',
            paddingTop: '15px',
        },
    }),
    TargetWrapper: styled.div({
        gridColumnStart: 3,
        gridColumnEnd: 4,
        gridRowStart: 3,
        gridRowEnd: 4,
        [MEDIA_QUERY.mobile]: {
            gridColumnStart: 1,
            gridColumnEnd: 3,
            gridRowStart: 3,
            gridRowEnd: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            borderBottom: '1px solid rgba(165, 165, 165, 0.5)',
            paddingBottom: '15px',
            paddingTop: '15px',
        },
    }),
    IconWrapper: styled.div({
        gridColumnStart: 4,
        gridColumnEnd: 5,
        gridRowStart: 3,
        gridRowEnd: 4,
        '&>svg': {
            marginLeft: 'auto',
        },
        [MEDIA_QUERY.mobile]: {
            gridColumnStart: 3,
            gridColumnEnd: 4,
            gridRowStart: 4,
            gridRowEnd: 5,
            paddingTop: '15px',
        },
    }),
    TypeValue: styled.div({
        textAlign: 'start',
        fontWeight: '700',
        fontSize: '22px',
        color: COLORS.beige,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        [MEDIA_QUERY.mobile]: {
            fontSize: '22px',
        },
    }),
};

const getDistance = (date) => {
    const currentMinutes = (date/ 1e6 - Date.now()) / 1000 / 60;
    const days = Math.floor(currentMinutes / (60 * 24) % 30);
    const hours = Math.floor((currentMinutes / 60) % 24);
    const minutes = Math.floor(currentMinutes % 60);
    return (days ? `${days}d `: '') + (hours ? `${hours}h ` : '') + `${minutes}m left`;
};

const ProposalCard = ({ type, proposer, description, votePeriodEnd, kind }) =>  (
    <Styles.Container>
        <Styles.TypeWrapper>
            <Styles.Title textAlign="start">Proposal type</Styles.Title>
            <Styles.TypeValue>{type}</Styles.TypeValue>
        </Styles.TypeWrapper>
        <Styles.ProposerWrapper>
            <Styles.Title>Proposer</Styles.Title>
            <Styles.Value>{proposer}</Styles.Value>
        </Styles.ProposerWrapper>
        <Styles.DescriptionWrapper>
            <Styles.Title>Description</Styles.Title>
            <Styles.Value>{description}</Styles.Value>
        </Styles.DescriptionWrapper>
        <Styles.TimeWrapper>
            <Styles.Title>Time</Styles.Title>
            <Styles.Value colorText="green">{getDistance(votePeriodEnd)}</Styles.Value>
        </Styles.TimeWrapper>
        <Styles.Line />
        <Styles.AmountWrapper>
            <Styles.Title textAlign="start">Amount</Styles.Title>
            <Styles.Value>{kind?.amount}</Styles.Value>
        </Styles.AmountWrapper>
        <Styles.TargetWrapper>
            <Styles.Title>Target</Styles.Title>
            <Styles.Value>{kind?.receiverId}</Styles.Value>
        </Styles.TargetWrapper>
        <Styles.IconWrapper style={{ display: 'flex', alignItems: 'center' }}>
            <OutIcon />
        </Styles.IconWrapper>
    </Styles.Container>
);

export default ProposalCard;
