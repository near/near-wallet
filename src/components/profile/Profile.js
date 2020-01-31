import React from 'react'
import { useSelector } from 'react-redux'

import PageContainer from '../common/PageContainer';
import ProfileDetails from './ProfileDetails'
import ProfileSection from './ProfileSection'
import ProfileQRCode from './ProfileQRCode';
import { Wallet } from '../../utils/wallet'

const wallet = new Wallet()

export function Profile({ match }) {
    const { accountId } = match.params
    const currentUser = useSelector(state => state.account)
    const [ account, setAccount ] = React.useState(
        currentUser.accountId === accountId && currentUser
    )
    const [ loading, setLoading ] = React.useState(!account)

    React.useEffect(() => {
        if (currentUser.accountId === accountId) {
            setAccount(currentUser)
        } else {
            setLoading(true)
            wallet.getAccount(accountId).state()
                .then(({ amount }) => {
                    setLoading(false)
                    setAccount({ accountId, amount })
                })
                .catch(err => {
                    setLoading(false)
                    setAccount(null)
                })
        }
    }, [accountId])

    if (loading) {
        return <PageContainer title="Loading..." />
    }

    if (!account) {
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
