import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { Wallet } from '../../utils/wallet'

import { handleRefreshAccount, handleRefreshUrl } from '../../actions/account'

import DashboardContainer from './DashboardContainer'
import DashboardSection from './DashboardSection'
import DashboardActivity from './DashboardActivity'

import TContractImage from '../../images/icon-t-contract.svg'
import activityGreyImage from '../../images/icon-activity-grey.svg'
import AccountGreyImage from '../../images/icon-account-grey.svg'
import AuthorizedGreyImage from '../../images/icon-authorized-grey.svg'
import ContactsGreyImage from '../../images/icon-contacts-grey.svg'

import TStakeImage from '../../images/icon-t-stake.svg'
import TTransferImage from '../../images/icon-t-transfer.svg'
import NearkatImage from '../../images/footer-nearkat.svg'

class DashboardDetail extends Component {
   state = {
      loader: false,
      notice: true,
      activity: [],
      authorizedaps: [],
      newcontacts: []
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
            activity: [
               [
                  TTransferImage,
                  'Sent: 125 Ⓝ  to @jake.near',
                  'Some details about this activity here',
                  '3 min ago'
               ],
               [
                  TStakeImage,
                  'You Staked 10 tokens',
                  'Some details about this activity here',
                  '20 min ago'
               ],
               [
                  TTransferImage,
                  'Sent: 125 Ⓝ  to @vlad.near',
                  'Some details about this activity here',
                  '1 hr ago'
               ]
            ],
            authorizedaps: [
               [NearkatImage, 'NEAR Place', '', '3 hrs ago'],
               [NearkatImage, 'Cryptocats', '', '5 hrs ago'],
               [NearkatImage, 'Knights App', '', '2 days ago']
            ],
            newcontacts: [
               [AccountGreyImage, 'Alex Skidanov ', '', 'Connected 2 days ago'],
               [AccountGreyImage, '@vlad.near', '', '2 days ago'],
               [
                  AccountGreyImage,
                  'Illia Polosukhin',
                  '',
                  'Connected 2 days ago'
               ]
            ],
            loader: false
         }))
      }, 1000)
   }

   handleNotice = () => {
      this.setState(state => ({
         notice: !state.notice
      }))
   }

   render() {
      const {
         loader,
         notice,
         activity,
         authorizedaps,
         newcontacts
      } = this.state

      return (
         <DashboardContainer>
            <DashboardSection notice={notice} handleNotice={this.handleNotice}>
               <DashboardActivity
                  loader={loader}
                  image={activityGreyImage}
                  title='Activity'
                  to='/'
                  activity={activity}
               />
               <DashboardActivity
                  loader={loader}
                  image={AuthorizedGreyImage}
                  title='Authorized Apps'
                  to='/authorized-apps'
                  activity={authorizedaps}
               />
               <DashboardActivity
                  loader={loader}
                  image={ContactsGreyImage}
                  title='New Contacts'
                  to='/contacts'
                  activity={newcontacts}
               />
            </DashboardSection>
         </DashboardContainer>
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

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(DashboardDetail))
