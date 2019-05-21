import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { Wallet } from '../../utils/wallet'
import { handleRefreshAccount, handleRefreshUrl } from '../../actions/account'

import PaginationBlock from '../pagination/PaginationBlock'
import ListItem from '../dashboard/ListItem'

import AuthorizedAppsContainer from './AuthorizedAppsContainer'

import NearkatImage from '../../images/footer-nearkat.svg'

class AuthorizedApps extends Component {
   state = {
      loader: false,
      showSub: false,
      showSubOpen: 0,
      activity: [],
      filterTypes: [
         { img: '', name: 'ALL' },
         { img: '', name: 'ALL' },
         { img: '', name: 'ALL' },
         { img: '', name: 'ALL' }
      ]
   }

   toggleShowSub = i => {
      i = i == null ? this.state.showSubOpen : i

      this.setState(state => ({
         showSub: i === state.showSubOpen ? !state.showSub : state.showSub,
         showSubOpen: i
      }))
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
               [NearkatImage, 'NEAR Place', '3 hrs ago', ''],
               [NearkatImage, 'Cryptocats', '5 hrs ago', ''],
               [NearkatImage, 'Knights App', '2 days ago', ''],
               [NearkatImage, 'NEAR Place', '3 hrs ago', ''],
               [NearkatImage, 'Cryptocats', '5 hrs ago', ''],
               [NearkatImage, 'Knights App', '2 days ago', ''],
               [NearkatImage, 'NEAR Place', '3 hrs ago', ''],
               [NearkatImage, 'Cryptocats', '5 hrs ago', ''],
               [NearkatImage, 'Knights App', '2 days ago', ''],
               [NearkatImage, 'NEAR Place', '3 hrs ago', '']
            ],
            loader: false
         }))
      }, 1000)
   }

   render() {
      const { activity, filterTypes, showSub, showSubOpen } = this.state

      return (
         <AuthorizedAppsContainer>
            <PaginationBlock
               filterTypes={filterTypes}
               showSub={showSub}
               toggleShowSub={this.toggleShowSub}
               subPage='authorized-apps'
            >
               {activity.map((row, i) => (
                  <ListItem
                     key={`a-${i}`}
                     row={row}
                     i={i}
                     wide={true}
                     showSub={showSub}
                     toggleShowSub={this.toggleShowSub}
                     showSubOpen={showSubOpen}
                  />
               ))}
            </PaginationBlock>
         </AuthorizedAppsContainer>
      )
   }
}

const mapDispatchToProps = {
   handleRefreshAccount,
   handleRefreshUrl
}

const mapStateToProps = () => ({})

export const AuthorizedAppsWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(AuthorizedApps))
