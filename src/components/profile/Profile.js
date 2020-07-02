import React from 'react'
import { Translate } from 'react-localize-redux'
import { useSelector } from 'react-redux'

import PageContainer from '../common/PageContainer';
import ProfileDetails from './ProfileDetails'
import ProfileSection from './ProfileSection'
import RecoveryContainer from './Recovery/RecoveryContainer'
import HardwareDevices from './hardware_devices/HardwareDevices'
import TwoFactorAuth from './two_factor/TwoFactorAuth'
import { LOADING, NOT_FOUND, useAccount } from '../../hooks/allAccounts'
import { wallet } from '../../utils/wallet'

export function Profile({ match }) {
    const loginAccountId = useSelector(state => state.account.accountId)
    const accountId = match.params.accountId || loginAccountId
    const account = useAccount(accountId)

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
                <button onClick={() => wallet.deployMultisig()}>Test</button>
                {accountId === loginAccountId && (
                    <>
                        <RecoveryContainer/>
                        <TwoFactorAuth/>
                        <HardwareDevices/>
                    </>
                )}
            </ProfileSection>
        </PageContainer>
    )
}
