import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { withRouter } from 'react-router-dom'

import {
   handleRefreshAccount,
   handleRefreshUrl,
   getAccountDetails
} from '../../actions/account'

import DashboardSection from './DashboardSection'
import DashboardActivity from './DashboardActivity'
import PageContainer from '../common/PageContainer';
import FormButton from '../common/FormButton'

import activityGreyImage from '../../images/icon-activity-grey.svg'
import AccountGreyImage from '../../images/icon-account-grey.svg'
import AuthorizedGreyImage from '../../images/icon-authorized-grey.svg'
import ContactsGreyImage from '../../images/icon-contacts-grey.svg'

import TStakeImage from '../../images/icon-t-stake.svg'
import TTransferImage from '../../images/icon-t-transfer.svg'
import AppDefaultImage from '../../images/icon-app-default.svg'

class DashboardDetail extends Component {
   state = {
      loader: false,
      notice: true,
      activity: [],
      authorizedApps: [],
      newcontacts: []
   }

   componentDidMount() {
      this.props.handleRefreshUrl(this.props.location)
      this.props.handleRefreshAccount(this.props.history)
      this.refreshAuthorizedApps()

      this.setState(() => ({
         loader: true
      }))

      false &&
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
               authorizedApps: [
                  [AppDefaultImage, 'NEAR Place', '', '3 hrs ago'],
                  [AppDefaultImage, 'Cryptocats', '', '5 hrs ago'],
                  [AppDefaultImage, 'Knights App', '', '2 days ago']
               ],
               newcontacts: [
                  [
                     AccountGreyImage,
                     'Alex Skidanov ',
                     '',
                     'Connected 2 days ago'
                  ],
                  [AccountGreyImage, '@vlad.near', '', '2 days ago'],
                  [
                     AccountGreyImage,
                     'Illia Polosukhin',
                     '',
                     'Connected 2 days ago'
                  ]
               ]
               // loader: false
            }))
         }, 1000)
   }

   refreshAuthorizedApps = () => {
      this.setState(() => ({
         loader: true
      }))

      this.props.getAccountDetails().then(() => {
         this.setState(() => ({
            loader: false
         }))
      })
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
         newcontacts
      } = this.state

      const { authorizedApps, amountStr } = this.props

      return (
         <PageContainer
            title={(
               <Fragment>
                  <span className='balance'>Balance: </span>
                  <span className='color-black'>{amountStr}</span>
                  <span className='near'>Ⓝ</span>
               </Fragment>
            )}
            additional={(
               <Link to='/send-money'>
                  <FormButton color='green-white-arrow' >
                     SEND MONEY
                  </FormButton>
               </Link>
            )}
         >
            <DashboardActivity
               loader={loader}
               image={AuthorizedGreyImage}
               title='Authorized Apps'
               to='/authorized-apps'
               activity={authorizedApps}
            />
            {false ? (
               <DashboardSection
                  notice={notice}
                  handleNotice={this.handleNotice}
               >
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
                     activity={authorizedApps}
                  />
                  <DashboardActivity
                     loader={loader}
                     image={ContactsGreyImage}
                     title='New Contacts'
                     to='/contacts'
                     activity={newcontacts}
                  />
               </DashboardSection>
            ) : null}
         </PageContainer>
      )
   }
}

const mapDispatchToProps = {
   handleRefreshAccount,
   handleRefreshUrl,
   getAccountDetails
}

const mapStateToProps = ({ account }) => ({
   ...account,
   authorizedApps: account.authorizedApps
      ? account.authorizedApps.map(r => [
           AppDefaultImage,
           r.contractId,
           r.amount,
           r.publicKey
        ])
      : []
})

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(DashboardDetail))
