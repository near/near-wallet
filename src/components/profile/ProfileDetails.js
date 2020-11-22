import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-localize-redux';

import { Popup, Grid, Image } from 'semantic-ui-react';
import Balance from '../common/Balance';
import InfoPopup from '../common/InfoPopup';
import LockImage from '../../images/icon-lock.svg';

import styled from 'styled-components';

const CustomGrid = styled(Grid)`
    &&& {
        .row {
            padding-top: 12px;
            padding-bottom: 12px;
            align-items: center;
            min-height: 58px;

            .edit-link {
                font-weight: 600;
            }
            .title {
                font-weight: 500;
                color: #24272a;
                display: flex;
                align-items: center;
            }
            .info-row {
                text-overflow: ellipsis;
                overflow: hidden; 
            }
        }

        .locked {
            float: right;
            border: 0px;
            padding: 1px 7px;
            width: 32px;
            height: 32px;
            background: #f8f8f8;
            border-radius: 32px;

            img {
                padding-top: 4px;
            }
        }

        .row-title {
            margin-top: 20px;
        }

        @media screen and (max-width: 991px) {
        }
        @media screen and (max-width: 767px) {
            margin-left: 0px;
            margin-right: 0px;

            .column {
                padding-left: 0px;
                padding-right: 0px;
            }
        }
    }
`;

const PublicInfoRow = ({ children, titleId, infoId }) => (
    <Grid.Row className='border-top'>
        <Grid.Column computer='4' tablet='4' mobile='7' className='title'>
            <Translate id={titleId} />
            {infoId ? <InfoPopup content={<Translate id={infoId}/>} /> : null}
        </Grid.Column>
        <Grid.Column computer='6' tablet='6' mobile='4'>
            {children}
        </Grid.Column>
        <Grid.Column computer='4' tablet='4' textAlign='center' only='tablet'>
            <Translate id='profile.details.public' />
        </Grid.Column>
        <Grid.Column as="div">
        </Grid.Column>
    </Grid.Row>
);

const PublicBalanceRow = ({ titleId, infoId, amount }) =>
    <PublicInfoRow titleId={titleId} infoId={infoId}>{amount && <Balance amount={amount}/>}</PublicInfoRow>;

const ProfileDetails = ({
    account: {
        accountId,
        balance: {
            total,
            stateStaked,
            staked,
            ownersBalance,
            lockedAmount,
            available
        }
    },
    isOwner
}) => (
    <CustomGrid>
        <Grid.Row>
            <Grid.Column
                computer='10'
                tablet='10'
                mobile='16'
                as='h6'
                className='color-charcoal-grey'
            >
                <Translate id='profile.details.profile' />
            </Grid.Column>
            <Grid.Column computer='4' as='h6' textAlign='center' only='tablet' className='color-charcoal-grey'>
                <Translate id='profile.details.visibleTo' />
            </Grid.Column>
        </Grid.Row>
        <Grid.Row className='border-top'>
            <Grid.Column computer='4' tablet='4' mobile='7' className='title'>
                <Translate id='profile.details.username' />
            </Grid.Column>
            <Grid.Column computer='6' tablet='6' mobile='4' className='info-row'>
                {accountId}
            </Grid.Column>
            <Grid.Column computer='4' tablet='4' textAlign='center' only='tablet'>
                <Translate id='profile.details.public' />
            </Grid.Column>
            {isOwner && (
                <Grid.Column computer='2' tablet='2' mobile='5' textAlign='right'>
                    <Popup
                        trigger={
                            <div className='locked'>
                                <Image src={LockImage} align='left' />
                            </div>
                        }
                        hoverable
                        position='left center'
                    >
                        <Popup.Header><Translate id='profile.details.lockPopup.title' /></Popup.Header>
                        <Popup.Content>
                            <Translate id='profile.details.lockPopup.text' data={{'link': <Link to="/create"><Translate id='profile.details.lockPopup.createAnotherAccount' /></Link>}} />
                            {` `}
                            {false ?
                                <a href='/'>Learn more</a>
                                : null}
                        </Popup.Content>
                    </Popup>
                </Grid.Column>
            )}
        </Grid.Row>
        <PublicBalanceRow titleId='profile.details.totalBalance' infoId='totalBalance' amount={total}/>
        <PublicBalanceRow titleId='profile.details.minBalance' infoId='minimumBalance' amount={stateStaked}/>
        {lockedAmount !== undefined
            ? <>
                <PublicBalanceRow titleId='profile.details.locked' infoId='lockedBalance' amount={lockedAmount}/>
                <PublicBalanceRow titleId='profile.details.unlocked' infoId='unlockedBalance' amount={ownersBalance}/>
            </>
            : null
        }
        <PublicBalanceRow titleId='profile.details.availableBalance' infoId='availableBalanceProfile' amount={available}/>
    </CustomGrid>
);

export default ProfileDetails;
