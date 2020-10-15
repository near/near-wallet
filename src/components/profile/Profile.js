import React, { useEffect } from 'react'
import { Translate } from 'react-localize-redux'
import { useDispatch, useSelector } from 'react-redux'
import PageContainer from '../common/PageContainer';
import ProfileDetails from './ProfileDetails'
import ProfileSection from './ProfileSection'
import RecoveryContainer from './Recovery/RecoveryContainer'
import HardwareDevices from './hardware_devices/HardwareDevices'
import TwoFactorAuth from './two_factor/TwoFactorAuth'
import { LOADING, NOT_FOUND, useAccount } from '../../hooks/allAccounts'
import { getLedgerKey, checkCanEnableTwoFactor, getAccessKeys } from '../../actions/account';

export function Profile({ match }) {
    const loginAccountId = useSelector(state => state.account.accountId)
    const recoveryMethods = useSelector(({ recoveryMethods }) => recoveryMethods);
    const accountId = match.params.accountId || loginAccountId
    const isOwner = accountId === loginAccountId
    const account = useAccount(accountId)
    const dispatch = useDispatch();
    const twoFactor = recoveryMethods[account.accountId] && recoveryMethods[account.accountId].filter(m => m.kind.includes('2fa'))[0]

    useEffect(() => { 
        if (isOwner) {
            getInitialData()
        }
    }, []);

    const getInitialData = async () => {
        await dispatch(getAccessKeys(accountId))
        await dispatch(getLedgerKey())
        await dispatch(checkCanEnableTwoFactor(account))
    }

    if (account.__status === LOADING) {
        return <PageContainer title={<Translate id='profile.pageTitle.loading' />} />
    }

    if (account.__status === NOT_FOUND) {
        return <PageContainer title={<Translate id='profile.pageTitle.notFound' data={{ accountId }} />} />
    }

    return (
        <PageContainer title={<Translate id='profile.pageTitle.default' data={{ accountId }} />}>
            <ProfileSection>
                <ProfileDetails account={account} isOwner={isOwner} />
                {isOwner && (
                    <>
                        <RecoveryContainer/>
                        {!account.ledgerKey && <TwoFactorAuth twoFactor={twoFactor}/>}
                        {!twoFactor && <HardwareDevices/>}
                    </>
                )}
            </ProfileSection>
        </PageContainer>
    )
}
