import React from 'react'
import { Translate } from 'react-localize-redux'
import moment from 'moment'
import Balance from '../common/Balance'

import IconTAcct from '../../images/IconTAcct'
import IconTKeyDelete from '../../images/IconTKeyDelete'
import IconTContract from '../../images/IconTContract'
import IconTCall from '../../images/IconTCall'
import IconTTransfer from '../../images/IconTTransfer'
import IconTStake from '../../images/IconTStake'
import IconTKeyNew from '../../images/IconTKeyNew'

import ArrowRight from '../../images/icon-arrow-right.svg'
import ArrowBlkImage from '../../images/icon-arrow-blk.svg'

import { Grid, Image } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomGridRow = styled(Grid.Row)`
   &&& {
      margin-left: 20px;
      border-left: 4px solid #f8f8f8;

      .col-image {
         margin-left: -15px;
         width: 40px;
         flex: 0 0 40px;
         padding-left: 0px;

         > div {
            border: 1px solid #e6e6e6;
            background: #fff;
            border-radius: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 26px;
            height: 26px;

            svg {
               width: 12px;
               height: 12px;
            }
         }
      }
      &.wide {
         margin-left: 0px;
         border-left: 0px;
      }
      .main-row-title {
         font-weight: 600;
         width: auto;
         padding-right: 0px;
         padding-left: 0px;
         flex: 1;
         word-break: break-all;
         display: flex;
         align-items: center;
         flex-direction: row !important;
         justify-content: space-between;
      }

      .dropdown-image-right {
         width: 10px;
         margin: 0 0 0 0;
      }
      .dropdown-image {
         float: right;
      }

      &.dropdown-down {
         background-color: #f8f8f8;

         .dropdown-image-right {
            width: 10px;
            top: 0px;
            left: 12px;
         }
      }

      &.showsub {
         .dropdown-image-right {
            left: -24px;
         }
      }
      &.showsub.dropdown-down {
         .dropdown-image-right {
            left: -6px;
         }
      }

      @media screen and (max-width: 767px) {
         &.showsub {
            .dropdown-image-right {
               left: -14px;
            }
         }
         &.showsub.dropdown-down {
            .dropdown-image-right {
               left: 4px;
            }
         }

         .main-row-title {
            a {
               font-size: 14px;
            }
         }
      }
   }
`

moment.updateLocale('en', {
   relativeTime : {
       future: "in %s",
       past:   "%s ago",
       s  : 'a few seconds',
       ss : '%d seconds',
       m:  "a minute",
       mm: "%d min",
       h:  "1 hr",
       hh: "%d hrs",
       d:  "1 day",
       dd: "%d days",
       M:  "1 month",
       MM: "%d months",
       y:  "1 year",
       yy: "%d years"
   }
});

const ActionsList = ({ transaction, actions, wide }) => 
   actions
      .map((a, i) => (
         <ActionRow 
            key={`action-${i}`} 
            transaction={transaction} 
            action={a} 
            actionKind={Object.keys(a)[0]}  
            wide={wide}
            i={i}
         />
      ))

const ActionRow = ({ transaction, action, actionKind, wide, showSub = false, toggleShowSub, showSubOpen, i }) => (
   <CustomGridRow
      verticalAlign='middle'
      className={`${wide ? `wide` : ``} ${
         showSub && showSubOpen === i ? `dropdown-down` : ``
      } ${showSub ? `showsub` : ``}`}
      onClick={() => wide && toggleShowSub(i, action)}
   >
      <Grid.Column
         computer={wide ? 15 : 16}
         tablet={wide ? 14 : 16}
         mobile={wide ? 14 : 16}
      >
         <Grid verticalAlign='middle'>
            <Grid.Column className='col-image'>
               <ActionIcon actionKind={actionKind} />
            </Grid.Column>
            <Grid.Column className='main-row-title color-black border-bottom'>
               <ActionMessage 
                  transaction={transaction}
                  action={action}
                  actionKind={actionKind}
               />
               <ActionTimeStamp
                  timeStamp={transaction.blockTimestamp}
               />
            </Grid.Column>
         </Grid>
      </Grid.Column>
      {wide && (
         <Grid.Column
            computer={1}
            tablet={2}
            mobile={2}
            textAlign='right'
         >
            <Image
               src={showSub && showSubOpen === i ? ArrowBlkImage : ArrowRight}
               className='dropdown-image dropdown-image-right'
            />
            {/* <span className='font-small'>{row[3]}</span> */}
         </Grid.Column>
      )}
   </CustomGridRow>
)

const ActionMessage = ({ transaction, action: { AddKey, FunctionCall, Transfer, Stake }, actionKind }) => (
   <Translate 
      id={`actions.${actionKind}${actionKind === `AddKey`
         ? AddKey.access_key && typeof AddKey.access_key.permission === 'object'
            ? `.forContract`
            : `.forReceiver`
         : ''
      }`}
      data={{
         receiverId: transaction.receiver_id || '',
         methodName: FunctionCall ? FunctionCall.method_name : '', 
         deposit: Transfer ? <Balance amount={Transfer.deposit} /> : '',
         stake: Stake ? Stake.stake : '',
         permissionReceiverId: (AddKey && AddKey.access_key && typeof AddKey.access_key.permission === 'object') ? AddKey.access_key.permission.FunctionCall.receiver_id : ''
      }}
   />
)

const ActionIcon = ({ actionKind }) => (
   <div>
      {actionKind === 'CreateAccount' && <IconTAcct />}
      {actionKind === 'DeleteAccount' && <IconTKeyDelete />}
      {actionKind === 'DeployContract' && <IconTContract />}
      {actionKind === 'FunctionCall' && <IconTCall />}
      {actionKind === 'Transfer' && <IconTTransfer />}
      {actionKind === 'Stake' && <IconTStake />}
      {actionKind === 'AddKey' && <IconTKeyNew />}
      {actionKind === 'DeleteKey' && <IconTKeyDelete />}
   </div>
)

const ActionTimeStamp = ({ timeStamp }) => (
   <div className='font-small'>{moment(timeStamp).fromNow()}</div>
)

export default ActionsList
