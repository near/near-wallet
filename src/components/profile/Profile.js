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
import { get2faMethod, getLedgerKey, checkCanEnableTwoFactor, getAccessKeys } from '../../actions/account';

export function Profile({ match }) {
    const loginAccountId = useSelector(state => state.account.accountId)
    const accountId = match.params.accountId || loginAccountId
    const account = useAccount(accountId)
    const dispatch = useDispatch();

    useEffect(() => { 
        dispatch(getAccessKeys(accountId))
        dispatch(getLedgerKey())
        dispatch(get2faMethod())
        dispatch(checkCanEnableTwoFactor(account))
    }, []);

    if (account.__status === LOADING) {
        return <PageContainer title={<Translate id='profile.pageTitle.loading' />} />
    }

    if (account.__status === NOT_FOUND) {
        return <PageContainer title={<Translate id='profile.pageTitle.notFound' data={{ accountId }} />} />
    }

    return (
        <PageContainer title={<Translate id='profile.pageTitle.default' data={{ accountId }} />}>
            <ProfileSection>
                <ProfileDetails account={account} />
                {accountId === loginAccountId && (
                    <>
                        <RecoveryContainer/>
                        {!account.ledgerKey && <TwoFactorAuth/>}
                        {!account.twoFactor && <HardwareDevices/>}
                    </>
                )}
            </ProfileSection>
        </PageContainer>
    )
}
