import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { Wallet } from '../../utils/wallet'
import { handleRefreshAccount, handleRefreshUrl, getAccountDetails, removeAccessKey } from '../../actions/account'

import PaginationBlock from '../pagination/PaginationBlock'
import ListItem from '../dashboard/ListItem'
import AuthorizedAppsContainer from './AuthorizedAppsContainer'

import AppDefaultImage from '../../images/icon-app-default.svg'

class AuthorizedApps extends Component {
   state = {
      loader: true,
      showSub: false,
      showSubOpen: 0,
      showSubData: [],
      authorizedApps: [],
      filterTypes: [{ img: '', name: 'ALL' }, { img: '', name: 'ALL' }, { img: '', name: 'ALL' }, { img: '', name: 'ALL' }]
   }

   toggleShowSub = (i, row) => {
      i = i == null ? this.state.showSubOpen : i

      this.setState(state => ({
         showSub: true,
         showSubOpen: i,
         showSubData: row
      }))
   }

   toggleCloseSub = () => {
      this.setState(() => ({
         showSub: false,
         showSubOpen: 0,
         showSubData: []
      }))
   }

   handleDeauthorize = () => {
      const publicKey = this.state.showSubData[3]

      this.setState(() => ({
         loader: true
      }))

      this.props.removeAccessKey(publicKey).then(() => {
         this.toggleCloseSub()
         this.refreshAuthorizedApps()
      })
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

   componentDidMount() {
      this.wallet = new Wallet()
      this.props.handleRefreshUrl(this.props.location)
      this.props.handleRefreshAccount(this.wallet, this.props.history)

      this.refreshAuthorizedApps()
   }

   render() {
      const { loader, filterTypes, showSub, showSubOpen, showSubData } = this.state

      const { authorizedApps } = this.props

      return (
         <AuthorizedAppsContainer loader={loader} total={authorizedApps.length}>
            <PaginationBlock filterTypes={filterTypes} showSub={showSub} showSubData={showSubData} toggleShowSub={this.toggleShowSub} toggleCloseSub={this.toggleCloseSub} subPage='authorized-apps' handleDeauthorize={this.handleDeauthorize}>
               {authorizedApps.map((row, i) => (
                  <ListItem key={`a-${i}`} row={row} i={i} wide={true} showSub={showSub} toggleShowSub={this.toggleShowSub} showSubOpen={showSubOpen} />
               ))}
            </PaginationBlock>
         </AuthorizedAppsContainer>
      )
   }
}

const mapDispatchToProps = {
   handleRefreshAccount,
   handleRefreshUrl,
   getAccountDetails,
   removeAccessKey
}

const mapStateToProps = ({ account }) => ({
   ...account,
   authorizedApps: account.authorizedApps ? account.authorizedApps.map(r => [AppDefaultImage, r.contractId, r.amount, r.publicKey]) : []
})

export const AuthorizedAppsWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(AuthorizedApps))
