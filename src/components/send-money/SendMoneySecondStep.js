import React, { Fragment } from 'react'

import { List, Header } from 'semantic-ui-react'

import PageContainer from '../common/PageContainer';
import MobileContainer from '../sign/MobileContainer'
import FormButton from '../common/FormButton'
import Balance from '../common/Balance'

import milli from '../../images/n-1000.svg'

const SendMoneySecondStep = ({
   handleNextStep,
   handleExpandNote,
   handleGoBack,
   handleCancelTransfer,
   expandNote,
   note,
   amount,
   accountId,
   loader
}) => (
   <MobileContainer>
      <Fragment>
         <PageContainer
            title={`Send Money`}
            type='center'
         />
         <List className='list-top border'>
            <List.Item as='h2' className='sending'>You are sending</List.Item>
            <List.Item className='amount-sending border-bottom'>
               {amount 
               ? <Balance milli={milli} amount={amount} /> 
               : "NaN"}
            </List.Item>
            <List.Item className='to'>
               <Header as='h2'>to</Header>
            </List.Item>
            <List.Item as='h2'>{accountId}</List.Item>
            <List.Item>@{accountId}</List.Item>
            {note && (
               <List.Item className='with-note '>
                  with note:
                  <br />
                  {expandNote ? (
                     <span className='color-black'>{note}</span>
                  ) : (
                     <span className='expand-note' onClick={handleExpandNote}>
                        Expand note
                     </span>
                  )}
               </List.Item>
            )}
         </List>
      </Fragment>
      <Fragment>
         <List className='list-bottom border'>
            <List.Item className='send-money border-top'>
               <FormButton
                  onClick={handleNextStep}
                  color='green'
                  disabled={loader}
                  sending={loader}
               >
                  CONFIRM & SEND
               </FormButton>
            </List.Item>
            <List.Item className='confirmed'>Once confirmed, this is not undoable.</List.Item>
            <List.Item className='goback border-top'>
               <FormButton
                  onClick={handleGoBack}
                  color='link bold'
                  disabled={loader}
               >
                  Need to edit? Go Back
               </FormButton>
            </List.Item>
         </List>
         <List className='cancel'>
            <FormButton
                  onClick={handleCancelTransfer}
                  color='link gray bold'
                  disabled={loader}
               >
               Cancel Transfer
            </FormButton>
         </List>
      </Fragment>
   </MobileContainer>
)

export default SendMoneySecondStep
