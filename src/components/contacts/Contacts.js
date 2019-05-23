import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { Wallet } from '../../utils/wallet'
import { handleRefreshAccount, handleRefreshUrl } from '../../actions/account'

import PaginationBlock from '../pagination/PaginationBlock'
import ListItem from '../dashboard/ListItem'
import ContactsContainer from './ContactsContainer'

import AccountGreyImage from '../../images/icon-account-grey.svg'

class Contacts extends Component {
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
               [AccountGreyImage, 'Alex Skidanov ', 'Connected 2 days ago', ''],
               [AccountGreyImage, '@vlad.near', '2 days ago', ''],
               [
                  AccountGreyImage,
                  'Illia Polosukhin',
                  'Connected 2 days ago',
                  ''
               ],
               [AccountGreyImage, 'Alex Skidanov ', 'Connected 2 days ago', ''],
               [AccountGreyImage, '@vlad.near', '2 days ago', ''],
               [
                  AccountGreyImage,
                  'Illia Polosukhin',
                  'Connected 2 days ago',
                  ''
               ],
               [AccountGreyImage, 'Alex Skidanov ', 'Connected 2 days ago', ''],
               [AccountGreyImage, '@vlad.near', '2 days ago', ''],
               [
                  AccountGreyImage,
                  'Illia Polosukhin',
                  'Connected 2 days ago',
                  ''
               ],
               [AccountGreyImage, 'Alex Skidanov ', 'Connected 2 days ago', '']
            ],
            loader: false
         }))
      }, 1000)
   }

   render() {
      const { activity, filterTypes, showSub, showSubOpen } = this.state

      return (
         <ContactsContainer>
            <PaginationBlock
               filterTypes={filterTypes}
               showSub={showSub}
               toggleShowSub={this.toggleShowSub}
            >
               {activity.map((row, i) => (
                  <ListItem
                     key={`c-${i}`}
                     row={row}
                     i={i}
                     wide={true}
                     showSub={showSub}
                     toggleShowSub={this.toggleShowSub}
                     showSubOpen={showSubOpen}
                  />
               ))}
            </PaginationBlock>
         </ContactsContainer>
      )
   }
}

const mapDispatchToProps = {
   handleRefreshAccount,
   handleRefreshUrl
}

const mapStateToProps = () => ({})

export const ContactsWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(Contacts))
