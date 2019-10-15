import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import SignContainer from './SignContainer'
import SignTransferReady from './SignTransferReady';
import SignTransferSuccess from './SignTransferSuccess';
import SignTransferCancelled from './SignTransferCancelled';
import SignTransferInsufficientFunds from './SignTransferInsufficientFunds';
import SignTransferTransferring from './SignTransferTransferring';
import SignTransferDetails from './SignTransferDetails';

class Sign extends Component {
   state = {
      transferReady: false,
      transferTransferring: false,
      transferTransferringStart: false,
      transferTransferringPending: false,
      transferTransferringEnd: false,
      transferSuccess: false,
      transferCancelled: false,
      transferInsufficientFunds: false,
      transferDetails: false,

      tx: [
         {
            contract: 'cryptocorgis',
            fees: null,
            methods: [
               {
                  name: 'Function Name',
                  desc: 'Here is a description of this function that the user can read and understand.',
                  alert: null
               },
               {
                  name: 'Function Name',
                  desc: '',
                  alert: 'gray'
               }
            ],
            gasLimit: null,
            gasPrice: null
         },
         {
            contract: 'corgi_or_dai',
            fees: null,
            methods: [
              {
                  name: 'Function Name',
                  desc: 'Money is being transferred here and you should pay attention.',
                  alert: 'orange'
               }
            ],
            gasLimit: null,
            gasPrice: null
         },
         {
            contract: null,
            fees: '.00042Ⓝ',
            methods: [],
            gasLimit: '2100',
            gasPrice: '.000000021Ⓝ'
         },
      ]
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

   handleDetails = (show) => {
      this.setState(() => ({
         transferReady: !show,
         transferDetails: show
      }))
   }

   render() {
      return (
         <SignContainer>
            {this.state.transferReady && <SignTransferReady {...this.state} handleAllow={this.handleAllow} handleDeny={this.handleDeny} handleDetails={this.handleDetails} />}
            {this.state.transferTransferring && <SignTransferTransferring {...this.state} />}
            {this.state.transferSuccess && <SignTransferSuccess handleDeny={this.handleDeny} />}
            {this.state.transferCancelled && <SignTransferCancelled handleDeny={this.handleDeny} />}
            {this.state.transferInsufficientFunds && <SignTransferInsufficientFunds handleDeny={this.handleDeny} handleAddFunds={this.handleAddFunds} />}
            {this.state.transferDetails && <SignTransferDetails handleDetails={this.handleDetails} tx={this.state.tx} />}
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
