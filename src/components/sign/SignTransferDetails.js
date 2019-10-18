import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { handleRefreshAccount, switchAccount } from '../../actions/account'

import { ReactComponent as IconArrowLeft } from '../../images/icon-arrow-left.svg'
import { ReactComponent as IconProblems } from '../../images/icon-problems.svg'

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
      padding: 0 18px;

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

                     &.gray {
                        polygon {
                           stroke: #999;
                        }
                        .cls-2 {
                           fill: #999;
                        }
                     }
                     &.orange {
                        polygon {
                           stroke: #fca347;
                        }
                        .cls-2 {
                           fill: #fca347;
                        }
                     }
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

class SignTransferReady extends Component {
   render() {
      const { handleDetails, transactions } = this.props

      return (
         <CustomGrid padded>
            <Grid.Row centered className='transactions'>
               <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                  <div className='top-back'>
                     <div 
                        className='back-button h3 font-benton color-blue'
                        onClick={() => handleDetails(false)}
                     >
                        <div><IconArrowLeft /></div>
                        <div>Back</div>
                     </div>
                  </div>
                  <div className='details'>
                     <div className='details-item title h3'>Detailed description of transaction</div>
                     <TransactionsList transactions={transactions} />
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
   actions.map((a, i) => (
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
         <ActionIcon actionKind={actionKind} />
         <ActionDescription 
            action={action} 
            actionKind={actionKind} 
         />
      </div>
   </div>
)

const ActionMessage = ({ transaction, action, actionKind }) => (
   <Fragment>
      {actionKind === 'createAccount' && `New account created: '${transaction.receiverId}'`}
      {actionKind === 'deployContract' && `Contract deployed: '${transaction.receiverId}'`}
      {actionKind === 'functionCall' && `Called method: '${action.functionCall.methodName}'`}
      {actionKind === 'transfer' && `Transferred: ${action.transfer.deposit}Ⓝ to '${transaction.receiverId}'`}
      {actionKind === 'stake' && `Staked: ${action.stake.stake}Ⓝ ${action.stake.publicKey.substring(0, 15)}...`}
      {actionKind === 'addKey' && (
         typeof action.addKey.accessKey.permission === 'object'
            ? `Access key added for contract: '${action.addKey.accessKey.permission.functionCall.receiverId}'`
            : `New key added for ${transaction.receiverId}: ${action.addKey.publicKey.substring(0, 15)}...`
      )}
      {actionKind === 'deleteKey' && `Key deleted: ${action.deleteKey.publicKey.substring(0, 15)}...`}
      {actionKind === 'deleteAccount' && `Account deleted: '${transaction.receiverId}'`}
   </Fragment>
)

const ActionIcon = ({ actionKind }) => (
   <div className='icon'>
      {actionKind === 'createAccount' && <IconProblems className='gray' />}
      {actionKind === 'deployContract' && <IconProblems className='orange' />}
      {actionKind === 'functionCall' && ''}
      {actionKind === 'transfer' && <IconProblems className='gray' />}
      {actionKind === 'stake' && <IconProblems className='orange' />}
      {actionKind === 'addKey' && <IconProblems className='gray' />}
      {actionKind === 'deleteKey' && <IconProblems className='gray' />}
      {actionKind === 'deleteAccount' && <IconProblems className='orange' />}
   </div>
)

const ActionDescription = ({ action, actionKind }) => (
   <Fragment>
      {actionKind === 'createAccount' && `No description specified for this method`}
      {actionKind === 'deployContract' && `No description specified for this method`}
      {actionKind === 'functionCall' && JSON.stringify(action.functionCall.args)}
      {actionKind === 'transfer' && `No description specified for this method`}
      {actionKind === 'stake' && `No description specified for this method`}
      {actionKind === 'addKey' && `No description specified for this method`}
      {actionKind === 'deleteKey' && `No description specified for this method`}
      {actionKind === 'deleteAccount' && `No description specified for this method`}
   </Fragment>
)

const mapDispatchToProps = {
   handleRefreshAccount,
   switchAccount,
}

const mapStateToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignTransferReady))
