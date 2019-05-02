import React, { Component } from 'react'
import { connect } from 'react-redux'

import { List, Image, Container, Grid, Button, Header } from 'semantic-ui-react'

import { withRouter } from 'react-router-dom'

import { Wallet } from '../../utils/wallet'

import PaginationBlock from '../pagination/PaginationBlock'
import ListItem from '../dashboard/ListItem'

import SendMoneyContainer from './SendMoneyContainer'
import SendMoneyFirstStep from './SendMoneyFirstStep'
import SendMoneySecondStep from './SendMoneySecondStep'

import TContractImage from '../../images/icon-t-contract.svg'
import activityGreyImage from '../../images/icon-activity-grey.svg'
import AccountGreyImage from '../../images/icon-account-grey.svg'
import AuthorizedGreyImage from '../../images/icon-authorized-grey.svg'
import ContactsGreyImage from '../../images/icon-contacts-grey.svg'

import TStakeImage from '../../images/icon-t-stake.svg'
import TTransferImage from '../../images/icon-t-transfer.svg'
import NearkatImage from '../../images/footer-nearkat.svg'

class SendMoney extends Component {
   state = {
      loader: false,
      step: 1,
      note: '',
      expandNote: false
   }

   toggleShowSub = i => {
      i = i == null ? this.state.showSubOpen : i

      this.setState(state => ({
         showSub: i === state.showSubOpen ? !state.showSub : state.showSub,
         showSubOpen: i
      }))
   }

   componentDidMount() {
      // this.wallet = new Wallet()
      // this.props.handleRefreshUrl(this.props.location)
      // this.props.handleRefreshAccount(this.wallet, this.props.history)

      this.setState(() => ({
         loader: true
      }))

      setTimeout(() => {
         this.setState(_ => ({
            loader: false
         }))
      }, 1000)
   }

   handleNextStep = () => {
      this.setState(() => ({
         step: 2
      }))
   }

   handleChange = (e, { name, value }) => {
      this.setState(() => ({
         [name]: value
      }))
   }

   handleExpandNote = () => {
      this.setState(() => ({
         expandNote: true
      }))
   }

   render() {
      const { loader, step, note, expandNote } = this.state

      return (
         <SendMoneyContainer>
            {step === 1 && (
               <SendMoneyFirstStep
                  handleNextStep={this.handleNextStep}
                  handleChange={this.handleChange}
                  note={note}
                  loader={loader}
               />
            )}
            {step === 2 && (
               <SendMoneySecondStep
                  handleExpandNote={this.handleExpandNote}
                  expandNote={expandNote}
                  note={note}
               />
            )}
         </SendMoneyContainer>
      )
   }
}

const mapDispatchToProps = {}

const mapStateToProps = ({}) => ({})

export const SendMoneyWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(SendMoney))
