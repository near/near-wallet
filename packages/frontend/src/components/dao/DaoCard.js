import React, { memo, useState, useCallback } from 'react';
import styled from 'styled-components';

import { COLORS, MEDIA_QUERY } from '../../utils/theme';
import ClickToCopy from '../common/ClickToCopy';
import CopyIcon from '../svg/CopyIcon';
import ExpandDownIcon from '../svg/ExpandDownIcon';
import UserIcon from '../svg/UserIcon';
import ProposalCard from './ProposalCard';
import DaoLogo from './DaoLogo';


const Styles = {
    Container: styled.div({
        borderRadius: '30px',
        padding: '30px 15px',
        fontFamily: '\'Poppins\', sans-serif',
        marginBottom: '40px',
        lineHeight: '175.4%',
    }),
    Dao: styled.div({
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        [MEDIA_QUERY.tablet]: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '30px',
        }
    }),
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

        [MEDIA_QUERY.tablet]: {
            display: 'none',
        },
    }),
    Name: styled.div({
        fontWeight: '500',
        fontSize: '18px',
        color: COLORS.beige,
        marginBottom: '10px',
        [MEDIA_QUERY.mobile]: {
            fontSize: '20px',
            fontWeight: '600',
        },
    }),
    Id: styled.div({
        fontWeight: '500',
        fontSize: '16px',
        color: COLORS.lightText,
        display: 'flex',
        alignItems: 'center',
        '& > div > svg': {
            width: '24px',
            height: '24px',
            marginLeft: '8px',
        },
        '& > div > svg > path': {
            stroke: COLORS.lightText,
        },
        [MEDIA_QUERY.mobile]: {
            fontSize: '16px',
            fontWeight: '500',
        },
    }),
    FundTitle: styled.div({
        fontWeight: '500',
        fontSize: '18px',
        color: COLORS.lightText,
        marginBottom: '10px',
        textAlign: 'center',
        [MEDIA_QUERY.tablet]: {
            textAlign: 'end',
        },
        [MEDIA_QUERY.mobile]: {
            fontSize: '16px',
            fontWeight: '500',
            textAlign: 'start',
        },
    }),
    Fund: styled.div({
        fontWeight: '500',
        fontSize: '20px',
        color: COLORS.green,
        textAlign: 'center',
        [MEDIA_QUERY.tablet]: {
            textAlign: 'end',
        },
        [MEDIA_QUERY.mobile]: {
            fontSize: '20px',
            fontWeight: '600',
            textAlign: 'start',
        },
    }),
    Proposals: styled.div({
        fontWeight: '400',
        fontSize: '18px',
        color: COLORS.green,
        background: COLORS.darkGreen,
        borderRadius: '15px',
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& > span': {
            color: COLORS.beige,
            marginLeft: '5px',
        },
        '& > svg': {
            marginLeft: '10px',
        },
        [MEDIA_QUERY.tablet]: {
            gridColumnStart: 1,
            gridColumnEnd: 2,
            gridRowStart: 2,
            gridRowEnd: 3,
        },
        [MEDIA_QUERY.mobile]: {
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 2,
            gridRowEnd: 4,
            fontSize: '20px',
            fontWeight: '500',
            flexWrap: 'wrap',
            justifyContent: 'center',
            '& > svg': {
                marginTop: '10px',
                marginLeft: '0px',
            },
        },
    }),
    MembersGroups: styled.div({
        fontWeight: '500',
        fontSize: '18px',
        color: COLORS.beige,
        textAlign: 'end',
        '& > div': {
            color: COLORS.lightText,
            marginBottom: '10px',
            fontSize: '18px',
        },
        [MEDIA_QUERY.tablet]: {
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 2,
            gridRowEnd: 3,
        },
        [MEDIA_QUERY.mobile]: {
            gridColumnStart: 1,
            gridColumnEnd: 2,
            gridRowStart: 3,
            gridRowEnd: 4,
            fontSize: '16px',
            textAlign: 'start',
            '& > div': {
                fontSize: '20px',
                fontWeight: '600',
            },
        },
    }),
    Flex: styled.div({
        display: 'flex',
        [MEDIA_QUERY.tablet]: {
            gridColumnStart: 1,
            gridColumnEnd: 2,
            gridRowStart: 1,
            gridRowEnd: 2,
        },
        [MEDIA_QUERY.mobile]: {
            gridColumnStart: 1,
            gridColumnEnd: 3,
            gridRowStart: 1,
            gridRowEnd: 2,
        },
    }),
    FundWrapper: styled.div({
        [MEDIA_QUERY.tablet]: {
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 1,
            gridRowEnd: 2,
        },
        [MEDIA_QUERY.mobile]: {
            gridColumnStart: 1,
            gridColumnEnd: 2,
            gridRowStart: 2,
            gridRowEnd: 3,
        },
    }),
};

const DaoCard = memo(({
    config: { name },
    id,
    totalDaoFunds,
    activeProposalCount,
    numberOfGroups,
    numberOfMembers,
    proposal,
    parsedMeta
}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = useCallback(() => {
        setOpen(!open);
    }, [open, setOpen]);

    return (
        <Styles.Container>
            <Styles.Dao>
                <Styles.Flex>
                    <DaoLogo src={parsedMeta.flagLogo} />
                    <div>
                        <Styles.Name>{name}</Styles.Name>
                        <Styles.Id>
                            {id}
                            <ClickToCopy copy={id}>
                                <CopyIcon/>
                            </ClickToCopy>
                        </Styles.Id>
                    </div>
                </Styles.Flex>
                <Styles.FundWrapper>
                    <Styles.FundTitle>DAO funds</Styles.FundTitle>
                    <Styles.Fund>{totalDaoFunds.toFixed(2)}</Styles.Fund>
                </Styles.FundWrapper>
                <Styles.Proposals>
                    {activeProposalCount}
                    <span>active</span>
                    <span>{' '}proposals</span>
                    {activeProposalCount ? (
                        <ExpandDownIcon
                            onClick={handleOpen}
                            style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)', cursor: 'pointer', transition: 'transform 0.3s' }}
                        />
                    ) : null}
                </Styles.Proposals>
                <Styles.MembersGroups>
                    <div>Members\Groups</div>
                    {numberOfMembers}\{numberOfGroups}
                </Styles.MembersGroups>
            </Styles.Dao>
            <div style={{maxHeight: open ? '10000px' : '0px', overflow: 'hidden', transition: 'max-height 0.5s'}}>
                {activeProposalCount ?
                    proposal.data.filter(({ status }) => status === 'InProgress')
                        .map((item) => (
                            <ProposalCard key={item.id} {...item}/>
                        )) : null
                }
            </div>
        </Styles.Container>
    );
});

export default DaoCard;
