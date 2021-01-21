import React, { useEffect } from 'react'
import { Translate } from 'react-localize-redux'
import { useDispatch, useSelector } from 'react-redux'
import PageContainer from '../common/PageContainer';
import Container from '../common/styled/Container.css'
import RecoveryContainer from './Recovery/RecoveryContainer'
import BalanceContainer from './balances/BalanceContainer'
import HardwareDevices from './hardware_devices/HardwareDevices'
import TwoFactorAuth from './two_factor/TwoFactorAuth'
import { LOADING, NOT_FOUND, useAccount } from '../../hooks/allAccounts'
import { getLedgerKey, checkCanEnableTwoFactor, getAccessKeys, redirectTo, getProfileBalance, transferAllFromLockup } from '../../actions/account'
import styled from 'styled-components'
import LockupAvailTransfer from './balances/LockupAvailTransfer'
import UserIcon from '../svg/UserIcon'
import ShieldIcon from '../svg/ShieldIcon'
import LockIcon from '../svg/LockIcon'
import { actionsPending } from '../../utils/alerts'
import BN from 'bn.js'

const StyledContainer = styled(Container)`

    @media (min-width: 992px) {
        .split {
            display: flex;
        }

        .left {
            flex: 1.5;
            margin-right: 50px;
        }

        .right {
            flex: 1;
        }
    }

    @media (max-width: 991px) {
        .right {
            margin-top: 50px;
        }
    }

    h2 {
        font-weight: 900 !important;
        font-size: 24px !important;
        margin: 10px 0;
        text-align: left !important;
        line-height: 140% !important;
        display: flex;
        align-items: center;

        svg {
            margin-right: 15px;

            &.user-icon {
                margin-right: 10px;
            }

            .background {
                display: none;
            }
        }
    }

    .left {
        @media (min-width: 992px) {
            h2 {
                margin-left: -20px;
            }
        }
    }

    .right {
        > h4 {
            margin: 50px 0 20px 0;
        }

        .recovery-option {
            margin-top: 15px;
        }
    }

    hr {
        border: 1px solid #F0F0F0;
        margin: 50px 0 40px 0;
    }

    .sub-heading {
        margin: 20px 0;
    }
`

export function Profile({ match }) {
    const { has2fa, profileBalance, formLoader } = useSelector(({ account }) => account)
    const loginAccountId = useSelector(state => state.account.accountId)
    const recoveryMethods = useSelector(({ recoveryMethods }) => recoveryMethods);
    const accountIdFromUrl = match.params.accountId
    const accountId = accountIdFromUrl || loginAccountId
    const isOwner = accountId === loginAccountId
    const account = useAccount(accountId)
    const dispatch = useDispatch();
    const twoFactor = has2fa && recoveryMethods[account.accountId] && recoveryMethods[account.accountId].filter(m => m.kind.includes('2fa'))[0]
    const balanceLoader = actionsPending('GET_PROFILE_BALANCE');

    useEffect(() => {
        dispatch(getProfileBalance(accountId))

        if (accountIdFromUrl && accountIdFromUrl !== accountIdFromUrl.toLowerCase()) {
            dispatch(redirectTo(`/profile/${accountIdFromUrl.toLowerCase()}`))
        }

        if (isOwner) {
            dispatch(getAccessKeys(accountId))
            dispatch(getLedgerKey())
            dispatch(checkCanEnableTwoFactor(account))
        }
    }, []);

    if (account.__status === LOADING) {
        return <PageContainer title={<Translate id='profile.pageTitle.loading' />} />
    }

    if (account.__status === NOT_FOUND) {
        return <PageContainer title={<Translate id='profile.pageTitle.notFound' data={{ accountId }} />} />
    }

    const handleTransferFromLockup = async () => {
        await dispatch(transferAllFromLockup())
    }

    return (
        <StyledContainer>
            {isOwner && profileBalance && profileBalance.lockupIdExists && !new BN(profileBalance.lockupBalance.unlocked.availableToTransfer).isZero() &&
                <LockupAvailTransfer
                    available={profileBalance.lockupBalance.unlocked.availableToTransfer || '0'}
                    onTransfer={handleTransferFromLockup}
                    loading={formLoader}
                />
            }
            <div className='split'>
                <div className='left'>
                    <h2><UserIcon/><Translate id='profile.pageTitle.default'/></h2>
                    <BalanceContainer
                        account={account}
                        profileBalance={profileBalance}
                        balanceLoader={balanceLoader}
                    />
                </div>
                {isOwner &&
                    <div className='right'>
                        <h2><ShieldIcon/><Translate id='profile.security.title'/></h2>
                        <h4><Translate id='profile.security.mostSecure'/></h4>
                        {!twoFactor && <HardwareDevices/>}
                        <RecoveryContainer type='phrase'/>
                        <h4><Translate id='profile.security.lessSecure'/></h4>
                        <RecoveryContainer type='email'/>
                        <RecoveryContainer type='phone'/>
                        {!account.ledgerKey &&
                            <>
                                <hr/>
                                <h2><LockIcon/><Translate id='profile.twoFactor'/></h2>
                                <div className='sub-heading'><Translate id='profile.twoFactorDesc'/></div>
                                {/* TODO: Also check recovery methods in DB for Ledger */}
                                <TwoFactorAuth twoFactor={twoFactor}/>
                            </>
                        }
                    </div>
                }
            </div>
        </StyledContainer>
    )
}
