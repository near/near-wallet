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

      // fakeAccount = this.props.account
      const fakeAccount = {
         recoveryMethods: [
             {
                 method: 'phone',
                 enabled: true,
                 timeStamp: 'Jan 8, 2020',
                 info: '14157974834'
             },
             {
                 method: 'email',
                 enabled: false,
                 timeStamp: 'Jan 1, 2020',
                 info: 'useremail@mail.com'
             },
             {
                 method: 'phrase',
                 enabled: true,
                 timeStamp: 'Jan 1, 2020'
             }
         ]
      }

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
               <RecoveryContainer account={fakeAccount}/>
               {/*<ProfileQRCode account={account} />*/}
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
