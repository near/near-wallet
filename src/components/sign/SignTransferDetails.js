import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import IconArrowLeft from '../../images/IconArrowLeft'
import IconProblems from '../../images/IconProblems'

import { Grid } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomGrid = styled(Grid)`
   .top-back {
      display: flex;
      padding-bottom: 12px;

      .back-button {
         display: flex;
         cursor: pointer;

         svg {
            margin: 0 12px 0 18px;
            width: 12px;

            polyline {
               stroke: #0072ce;
            }
         }
      }
   }
   .details {
      background: #f8f8f8;
      padding: 0 18px 36px;

      .details-item {
         padding: 12px 0px;
         border-bottom: 1px solid #e6e6e6;

         .title {
            padding: 6px 0 0 0;
         }
         .details-subitem {
            padding: 12px 12px 0;

            .desc {
               display: flex;
               padding-top: 4px;
               line-height: 16px;

               .icon {
                  margin-right: 10px;
                  margin-top: 2px;

                  svg {
                     width: 26px;
                  }
               }
            }
         }
      }
   }
   @media screen and (max-width: 767px) {
      &&& {
         .details {
            min-height: calc(100vh - 126px);
         }
         .transactions {
            padding: 0px;

            > .column {
               padding: 0px;
            }
         }
      }
   }
`

class SignTransferDetails extends Component {
   render() {
      const { handleDetails, transactions, fees } = this.props

      return (
         <CustomGrid padded>
            <Grid.Row centered className='transactions'>
               <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                  <div className='top-back'>
                     <div 
                        className='back-button h3 font-benton color-blue'
                        onClick={() => handleDetails(false)}
                     >
                        <div><IconArrowLeft color='#0072ce' /></div>
                        <div>Back</div>
                     </div>
                  </div>
                  <div className='details'>
                     <div className='details-item title h3'>Detailed description of transaction</div>
                     <TransactionsList transactions={transactions} />

                     <div className='details-item'>
                        <div className='title h3'>
                           Transaction Fees
                           {/* .00042Ⓝ */}
                        </div>
                        {/* {t.fees} */}
                        <div className='details-subitem color-charcoal-grey'>
                           <div>Gas Limit: {fees.gasLimit}</div>
                           <div>Gas price estimate is unavailable</div>
                           {/* <div>Gas Price: .000000021Ⓝ</div> */}
                        </div>
                     </div>
                  </div>
               </Grid.Column>
            </Grid.Row>
         </CustomGrid>
      )
   }
}

const TransactionsList = ({ transactions }) => 
   transactions.map((t, i) => (
      <div key={`item-${i}`} className='details-item'>
         <div className='title h3'>
            For Contract: <span className='color-blue'>@{t.signerId}</span>
         </div>
         <ActionsList 
            transaction={t} 
            actions={t.actions}
         />
      </div>
))

const ActionsList = ({ transaction, actions }) => 
   actions
      .sort((a,b) => Object.keys(b)[0] === 'functionCall' ? 1 : -1)
      .map((a, i) => (
         <ActionRow 
            key={`action-${i}`} 
            transaction={transaction} 
            action={a} 
            actionKind={Object.keys(a)[0]}  
         />
))

const ActionRow = ({ transaction, action, actionKind }) => (
   <div key={`subitem-`} className='details-subitem font-bold color-charcoal-grey'>
      <ActionMessage 
         transaction={transaction} 
         action={action} 
         actionKind={actionKind} 
      />
      <div className='desc font-small'>
         <ActionWarrning 
            actionKind={actionKind} 
         />
      </div>
   </div>
)

const ActionMessage = ({ transaction, action, actionKind }) => (
   <Fragment>
      {actionKind === 'createAccount' && `Creating Account: '${transaction.receiverId}'`}
      {actionKind === 'deployContract' && `Deploying Contract: '${transaction.receiverId}'`}
      {actionKind === 'functionCall' && `Calling function: '${action.functionCall.methodName}'`}
      {actionKind === 'transfer' && `Transferring: ${action.transfer.deposit}Ⓝ to '${transaction.receiverId}'`}
      {actionKind === 'stake' && `Staking: ${action.stake.stake}Ⓝ ${action.stake.publicKey.substring(0, 15)}...`}
      {actionKind === 'addKey' && `Adding access key`}
      {actionKind === 'deleteKey' && `Deleting access key`}
      {actionKind === 'deleteAccount' && `Deleting account: '${transaction.receiverId}'`}
   </Fragment>
)

const ActionWarrning = ({ actionKind }) => (
   <Fragment>
      {actionKind === 'functionCall' && (
         <Fragment>
            <div className='icon'><IconProblems color='#999' /></div>
            No description specified for this function
         </Fragment>
      )}
      {actionKind === 'deployContract' && (
         <Fragment>
            <div className='icon'><IconProblems color='#fca347' /></div>
            You are about to deploy a contract to your account! This contract can access your NEAR balance, and interact with other contracts on your behalf.
         </Fragment>
      )}
      {actionKind === 'stake' && (
         <Fragment>
            <div className='icon'><IconProblems color='#fca347' /></div>
            You are about to stake NEAR tokens. These tokens will be locked, and are at risk of being lost if your validator becomes unresponsive.
         </Fragment>
      )}
      {actionKind === 'deleteAccount' && (
         <Fragment>
            <div className='icon'><IconProblems color='#fca347' /></div>
            You are about to delete your account! Your NEAR balance will be destroyed, and all of your account data deleted.
         </Fragment>
      )}
   </Fragment>
)

const mapDispatchToProps = {}

const mapStateToProps = ({ account }) => ({
   account,
   ...account.sign,
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignTransferDetails))
