import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import PageContainer from '../common/PageContainer';
import ProfileDetails from './ProfileDetails'
import ProfileSection from './ProfileSection'
import ProfileYourKeys from './ProfileYourKeys'
import ProfileNotice from './ProfileNotice'
import ProfileQRCode from './ProfileQRCode';
import RecoveryContainer from './Recovery/RecoveryContainer';

class Profile extends Component {
   state = {
      loader: false
   }

   componentDidMount() {}

   render() {
      const { account } = this.props

      return (
         <PageContainer
            title={`Account: @${account.accountId ? account.accountId : ``}`}
         >
            <ProfileSection>
               <ProfileDetails account={account} />
               { false ?
               <ProfileYourKeys />
               : null }
               { false ?
               <ProfileNotice />
               : null }
               <RecoveryContainer account={account}/>
               <ProfileQRCode account={account} />
            </ProfileSection>
         </PageContainer>
      )
   }
}

const mapDispatchToProps = {}

const mapStateToProps = ({ account }) => ({
   account
})

export const ProfileWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(Profile))
