import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { transactions as transaction, utils } from 'nearlib'
import * as qs from 'query-string'

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
            {this.state.transferReady && <SignTransferReady {...this.state} handleAllow={this.handleAllow} handleDeny={this.handleDeny} handleDetails={this.handleDetails} sensitiveActionsCounter={this.props.sensitiveActionsCounter} />}
            {this.state.transferTransferring && <SignTransferTransferring {...this.state} />}
            {this.state.transferSuccess && <SignTransferSuccess handleDeny={this.handleDeny} />}
            {this.state.transferCancelled && <SignTransferCancelled handleDeny={this.handleDeny} />}
            {this.state.transferInsufficientFunds && <SignTransferInsufficientFunds handleDeny={this.handleDeny} handleAddFunds={this.handleAddFunds} />}
            {this.state.transferDetails && <SignTransferDetails handleDetails={this.handleDetails} transactions={this.state.transactions} fees={this.props.fees} />}
         </SignContainer>
      )
   }
}

const mapDispatchToProps = {}

const mapStateToProps = ({ account, router: { location: { search } } }) => {
   // TODO: Remove dummy data
   /*
   transactions = [
      {
         signerId: 'cryptocorgis',
         receiverId: 'account id',
         actions: [
            {
               createAccount: {},
            },
            {
               deployContract: {},
            },
            {
               functionCall: {
                  methodName: 'Method Name',
                  args: [1,2,3],
                  gas: 123
               },
            },
            {
               transfer: {
                  deposit: 123
               },
            },
            {
               stake: {
                  stake: 123,
                  publicKey: 'dasdasadsdasdasadsadsadsdsaadsdas'
               },
            },
            {
               addKey: {
                  publicKey: 'dasdasadsdasdasadsadsadsdsaadsdas',
                  accessKey: {
                     permission: {
                        functionCall: {
                           receiverId: 'receiver id'
                        }
                     }
                  }
               },
            },
            {
               deleteKey: {
                  publicKey: 'dasdasadsdasdasadsadsadsdsaadsdas'
               },
            },
            {
               deleteAccount: {},
            }
         ]
      },
      {
         signerId: 'cryptocorgis',
         receiverId: 'account id',
         actions: [
            {
               deployContract: {}
            },
            {
               functionCall: {
                  methodName: 'Method Name',
                  args: [1,2,3],
                  gas: 123
               },
            },
         ]
      }
   ]*/
   const { transactions: transactionsSerialized } = qs.parse(search)
   const transactions = transactionsSerialized.split(',')
      .map(str => Buffer.from(str, 'base64'))
      .map(buffer => utils.serialize.deserialize(transaction.SCHEMA, transaction.Transaction, buffer))

   return {
      account,
      transactions,
      fees: {
         transactionFees: '',
         gasLimit: transactions.reduce((c, t) => 
            c + t.actions.reduce((ca, a) => 
               Object.keys(a)[0] === 'functionCall'
                  ? ca + a.functionCall.gas
                  : ca
            , 0)
         , 0),
         gasPrice: ''
      },
      sensitiveActionsCounter: transactions.reduce((c, t) => 
         c + t.actions.reduce((ca, a) => 
            ['deployContract', 'stake', 'deleteAccount'].indexOf(Object.keys(a)[0]) > -1
               ? ca + 1
               : ca
         , 0)
      , 0)
   }
}

export const SignWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(Sign))
