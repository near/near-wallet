import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { withRouter } from 'react-router-dom'

import { getAccessKeys, getTransactions } from '../../actions/account'

import DashboardSection from './DashboardSection'
import DashboardActivity from './DashboardActivity'
import PageContainer from '../common/PageContainer'
import FormButton from '../common/FormButton'
import Balance from '../common/Balance'

import activityGreyImage from '../../images/icon-activity-grey.svg'
import AuthorizedGreyImage from '../../images/icon-authorized-grey.svg'

import DashboardKeys from './DashboardKeys'

class DashboardDetail extends Component {
   state = {
      loader: false,
      notice: false
   }

   componentDidMount() {
      this.refreshAccessKeys()
      this.refreshTransactions()

      this.setState(() => ({
         loader: true
      }))
   }

   refreshTransactions() {
      this.props.getTransactions()
   }

   refreshAccessKeys = () => {
      this.setState(() => ({
         loader: true
      }))

      this.props.getAccessKeys().then(() => {
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
      const { loader, notice } = this.state
      const { authorizedApps, fullAccessKeys, transactions, amount, accountId } = this.props
      return (
         <PageContainer
            title={(
               amount
                  ? <Fragment>
                     <span className='balance'>Balance: </span>
                     <Balance amount={amount} />
                  </Fragment>
                  : "Balance loading"
            )}
            additional={(
               <Link to='/send-money'>
                  <FormButton color='green-white-arrow' >
                     SEND TOKENS
                  </FormButton>
               </Link>
            )}
         >
            <DashboardSection
               notice={notice}
               handleNotice={this.handleNotice}
            >
               <DashboardActivity
                  loader={loader}
                  image={activityGreyImage}
                  title='Activity'
                  to={`${process.env.EXPLORER_URL || 'https://explorer.nearprotocol.com'}/accounts/${accountId}`}
                  transactions={transactions}
                  maxItems={5}
               />
               <DashboardKeys
                  image={AuthorizedGreyImage}
                  title='Authorized Apps'
                  to='/authorized-apps'
                  accessKeys={authorizedApps}
               />
               <DashboardKeys
                  image={AuthorizedGreyImage}
                  title='Full Access Keys'
                  to='/full-access-keys'
                  accessKeys={fullAccessKeys}
               />
            </DashboardSection>
         </PageContainer>
      )
   }
}

const mapDispatchToProps = {
   getAccessKeys,
   getTransactions
}

// make sure that an action is an object, for UI purpose
const postprocessSerdeStruct = (action) => typeof action == 'object' ? [action] : [{[action]: {}}]

const mapStateToProps = ({ account }) => {
   const transactions = account.transactions 
      ? account.transactions.flatMap(t => t.actions.map((a) => ({
         ...t,
         action: postprocessSerdeStruct(a)
      })))
      : []

   return {
      ...account,
      authorizedApps: account.authorizedApps,
      fullAccessKeys: account.fullAccessKeys,
      transactions
   }
}

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(DashboardDetail))
