import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { Wallet } from '../../utils/wallet'

import { handleRefreshAccount, handleRefreshUrl } from '../../actions/account'

import ProfileContainer from './ProfileContainer'
import ProfileDetails from './ProfileDetails'
import ProfileSection from './ProfileSection'
import ProfileYourKeys from './ProfileYourKeys'
import ProfileNotice from './ProfileNotice'

import TContractImage from '../../images/icon-t-contract.svg'
import activityGreyImage from '../../images/icon-activity-grey.svg'
import AccountGreyImage from '../../images/icon-account-grey.svg'
import AuthorizedGreyImage from '../../images/icon-authorized-grey.svg'
import ContactsGreyImage from '../../images/icon-contacts-grey.svg'

import TStakeImage from '../../images/icon-t-stake.svg'
import TTransferImage from '../../images/icon-t-transfer.svg'
import NearkatImage from '../../images/footer-nearkat.svg'

class Profile extends Component {
   state = {
      loader: false
   }

   componentDidMount() {
      this.wallet = new Wallet()
      this.props.handleRefreshUrl(this.props.location)
      this.props.handleRefreshAccount(this.wallet, this.props.history)

      this.setState(() => ({
         loader: true
      }))

      setTimeout(() => {
         this.setState(_ => ({
            loader: false
         }))
      }, 1000)
   }

   render() {
      const { loader } = this.state

      return (
         <ProfileContainer>
            <ProfileSection>
               <ProfileDetails />
               <ProfileYourKeys />
               <ProfileNotice />
            </ProfileSection>
         </ProfileContainer>
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
