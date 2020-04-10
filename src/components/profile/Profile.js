import React from 'react'
import { Translate } from 'react-localize-redux'

import PageContainer from '../common/PageContainer';
import ProfileDetails from './ProfileDetails'
import ProfileSection from './ProfileSection'
import ProfileQRCode from './ProfileQRCode';
import RecoveryContainer from './Recovery/RecoveryContainer'
import { LOADING, NOT_FOUND, useAccount } from '../../hooks/allAccounts'
import { useRecoveryMethods } from '../../hooks/recoveryMethods'

export function Profile({ match }) {
    const { accountId } = match.params
    const account = useAccount(accountId)
    const recoveryMethods = useRecoveryMethods(account.accountId)
    React.useEffect(() => {
        console.log('recoveryMethods:', recoveryMethods)
    }, [recoveryMethods])

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
                <RecoveryContainer activeMethods={recoveryMethods}/>
            </ProfileSection>
        </PageContainer>
    )
}