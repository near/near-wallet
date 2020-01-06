import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'

import IconArrowLeft from '../../images/IconArrowLeft'
import IconProblems from '../../images/IconProblems'

import { Grid } from 'semantic-ui-react'

import styled from 'styled-components'
import GlobalAlert from '../responsive/GlobalAlert'

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
         }
      }
   }   
   .details {
      background: #f8f8f8;
      padding: 0 18px 36px;

      .details-item {
         padding: 12px 0px;
         border-bottom: 1px solid #e6e6e6;

         &.alert {
            .content {
               word-break: break-word;
            }
         }
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

class LoginDetails extends Component {
   render() {
      const { contractId, transactions, fees, appTitle } = this.props

      return (
         <CustomGrid padded>
            <Grid.Row centered className='transactions'>
               <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                  <div className='top-back'>
                     <Link to='/login'>
                        <div className='back-button h3 font-benton color-blue'>
                           <div><IconArrowLeft color='#0072ce' /></div>
                           <div>Back</div>
                        </div>
                     </Link>
                  </div>
                  {contractId && (
                     <div className='details'>
                        <div className='details-item title h3'>Detailed description of transaction</div>
                        <TransactionsList transactions={transactions} />

                        {false && <div className='details-item'>
                           <div className='title h3'>
                              Transaction Allowance
                           </div>
                           <div className='details-subitem font-bold color-charcoal-grey'>
                              <div className='desc font-small'>
                                 This app can use your NEAR for transaction fees
                              </div>
                              <div>
                                 Total Allowance: .001Ⓝ
                              </div>
                           </div>
                        </div>}
                        {false && <div className='details-item'>
                           <div className='title h3'>
                              Transaction Fees
                           </div>
                           <div className='details-subitem font-bold color-charcoal-grey'>
                              <div>Gas Limit: {fees.gasLimit}</div>
                              <div>Gas price estimate is unavailable</div>
                           </div>
                        </div>}
                     </div>
                  )}
                  {!contractId && (
                     <div className='details'>
                        <div className='details-item alert'>
                           <GlobalAlert 
                              globalAlert={{
                                 success: false,
                                 messageCodeHeader: 'Warning',
                                 messageCodeDescription: 'This allows access to your entire balance. Please proceed with caution.'
                              }}
                              closeIcom={false}
                           />
                        </div>
                        <div className='details-item'>
                           <div className='title h3'>
                              This allows {appTitle} to:
                           </div>
                           <div className='details-subitem color-charcoal-grey'>
                              <div>Create new accounts</div>
                           </div>
                           <div className='details-subitem color-charcoal-grey'>
                              <div>Transfer tokens from your account to other accounts</div>
                           </div>
                           <div className='details-subitem color-charcoal-grey'>
                              <div>Deploy smart contracts</div>
                           </div>
                           <div className='details-subitem color-charcoal-grey'>
                              <div>Call functions on any smart contract</div>
                           </div>
                           <div className='details-subitem color-charcoal-grey'>
                              <div>Stake and unstake NEAR tokens</div>
                           </div>
                           <div className='details-subitem color-charcoal-grey'>
                              <div>Create and delete access keys</div>
                           </div>
                        </div>
                     </div>
                  )}
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
            For Contract: <a href={`${process.env.EXPLORER_URL || 'https://explorer.nearprotocol.com'}/accounts/${t.signerId}`} target='_blank' rel="noopener noreferrer" className='color-blue'>@{t.signerId}</a>
         </div>
         {false &&  <ActionsList 
            transaction={t} 
            actions={t.actions}
         />}
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
      {actionKind === 'functionCall' && `Function: ${action.functionCall.methodName}`}
   </Fragment>
)

const ActionWarrning = ({ actionKind }) => (
   <Fragment>
      {actionKind === 'functionCall' && (
         <Fragment>
            <div className='icon'><IconProblems color='#999' /></div>
            No description specified for this method
         </Fragment>
      )}
   </Fragment>
)

const mapDispatchToProps = {}

const mapStateToProps = ({ transactions = [], account }) => {
   transactions = [
      {
         signerId: account.url.contract_id,
         receiverId: 'account id',
         actions: [
            {
               functionCall: {
                  methodName: 'createCorgi',
                  args: [1,2,3],
                  gas: 123
               },
            },
            {
               functionCall: {
                  methodName: 'walkCorgi',
                  args: [1,2,3],
                  gas: 321
               },
            }
         ]
      }
   ]
   
   return {
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginDetails))
