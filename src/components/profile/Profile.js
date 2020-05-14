import React from 'react'
import { Translate } from 'react-localize-redux'

import PageContainer from '../common/PageContainer';
import ProfileDetails from './ProfileDetails'
import ProfileSection from './ProfileSection'
import RecoveryContainer from './Recovery/RecoveryContainer'
import { LOADING, NOT_FOUND, useAccount } from '../../hooks/allAccounts'
import { useRecoveryMethods } from '../../hooks/recoveryMethods'

export function Profile({ match }) {
    const { accountId } = match.params
    const account = useAccount(accountId)
    const recoveryMethods = useRecoveryMethods(account.accountId)

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
                <RecoveryContainer
                    accountId={accountId}
                    activeMethods={recoveryMethods}
                />
            </ProfileSection>
        </PageContainer>
    )
}