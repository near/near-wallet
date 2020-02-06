import React from 'react'

import PageContainer from '../common/PageContainer';
import ProfileDetails from './ProfileDetails'
import ProfileSection from './ProfileSection'
import ProfileQRCode from './ProfileQRCode';
import { LOADING, NOT_FOUND, useAccount } from '../../hooks/allAccounts'

export function Profile({ match }) {
    const { accountId } = match.params
    const account = useAccount(accountId)

    if (account.__status === LOADING) {
        return <PageContainer title="Loading..." />
    }

    if (account.__status === NOT_FOUND) {
        return <PageContainer title={`Account @${accountId} not found`} />
    }

    return (
        <PageContainer title={`Account: @${accountId}`}>
            <ProfileSection>
                <ProfileDetails account={account} />
                <ProfileQRCode account={account} />
            </ProfileSection>
        </PageContainer>
    )
}
