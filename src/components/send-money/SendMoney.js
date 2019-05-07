import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import SendMoneyContainer from './SendMoneyContainer'
import SendMoneyFirstStep from './SendMoneyFirstStep'
import SendMoneySecondStep from './SendMoneySecondStep'

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
