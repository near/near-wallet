import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { handleRefreshAccount, handleRefreshUrl } from '../../actions/account'

import PageContainer from '../common/PageContainer';
import ProfileDetails from './ProfileDetails'
import ProfileSection from './ProfileSection'
import ProfileYourKeys from './ProfileYourKeys'
import ProfileNotice from './ProfileNotice'

class Profile extends Component {
   state = {
      loader: false
   }

   componentDidMount() {
      this.props.handleRefreshUrl(this.props.location)
      this.props.handleRefreshAccount(this.props.history)
   }

   render() {
      const { account } = this.props

      return (
         <PageContainer
            title={`Account: @${account.accountId ? account.accountId : ``}`}
         >
            <ProfileSection>
               <ProfileDetails account={this.props.account} />
               { false ?
               <ProfileYourKeys />
               : null }
               { false ?
               <ProfileNotice />
               : null }
            </ProfileSection>
         </PageContainer>
      )
   }
}

const mapDispatchToProps = {
   handleRefreshAccount,
   handleRefreshUrl
}

const mapStateToProps = ({ account }) => ({
   account
})

export const ProfileWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(Profile))
