import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import SignContainer from './SignContainer'
import SignTransferReady from './SignTransferReady';
import SignTransferSuccess from './SignTransferSuccess';
import SignTransferCancelled from './SignTransferCancelled';
import SignTransferInsufficientFunds from './SignTransferInsufficientFunds';
import SignTransferTransferring from './SignTransferTransferring';

class Sign extends Component {
   state = {
      transferReady: false,
      transferTransferring: false,
      transferTransferringStart: false,
      transferTransferringPending: false,
      transferTransferringEnd: false,
      transferSuccess: false,
      transferCancelled: false,
      transferInsufficientFunds: false
   }

   componentDidMount = () => {
      this.setState(() => ({
         transferReady: true
      }))
   }

   handleDeny = e => {
      e.preventDefault();
      if (this.props.account.url.callback) {
         window.location.href = this.props.account.url.callback
      }
   }

   handleAddFunds = () => {
      this.props.history.push('/profile')
   }

   handleAllow = e => {
      this.setState(() => ({
         transferReady: false,
         transferTransferring: true,
         transferTransferringStart: true
      }))

      setTimeout(() => {
         this.setState(() => ({
            transferTransferringPending: true
         }))

         //actions
         setTimeout(() => {
            this.setState(() => ({
               transferTransferringEnd: true
            }))

            //finally
            setTimeout(() => {
               this.setState(() => ({
                  transferTransferring: false,
                  
                  transferSuccess: true,
                  // transferCancelled: true,
                  // transferInsufficientFunds: true
               }))
            }, 1000);
         }, 2500);
      }, 500);
   }

   render() {
      return (
         <SignContainer>
            {this.state.transferReady && <SignTransferReady {...this.state} handleAllow={this.handleAllow} handleDeny={this.handleDeny} />}
            {this.state.transferTransferring && <SignTransferTransferring {...this.state} />}
            {this.state.transferSuccess && <SignTransferSuccess handleDeny={this.handleDeny} />}
            {this.state.transferCancelled && <SignTransferCancelled handleDeny={this.handleDeny} />}
            {this.state.transferInsufficientFunds && <SignTransferInsufficientFunds handleDeny={this.handleDeny} handleAddFunds={this.handleAddFunds} />}
         </SignContainer>
      )
   }
}

const mapDispatchToProps = {
   
}

const mapStateToProps = ({ account }) => ({
   account
})

export const SignWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(Sign))
