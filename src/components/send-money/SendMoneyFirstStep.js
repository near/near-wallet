import React, { Fragment } from 'react'

import {
   Header,
   TextArea,
   List,
   Form,
   Responsive
} from 'semantic-ui-react'

import PageContainer from '../common/PageContainer'
import MobileContainer from '../sign/MobileContainer'
import FormButton from '../common/FormButton'
import RequestStatusBox from '../common/RequestStatusBox'
import AccountFormAccountId from '../accounts/AccountFormAccountId'
import SendMoneyAmountInput from './SendMoneyAmountInput'

const SendMoneyFirstStep = ({
   handleNextStep,
   handleChange,
   note,
   paramAccountId,
   accountId,
   isLegitForm,
   formLoader,
   requestStatus,
   amount
}) => {
   return (
      <Form autoComplete='off'>
         <MobileContainer>
            <Fragment>
               <PageContainer
                  title={`Send Money`}
                  type='center'
               />
               <List className='list-top border'>
                     {paramAccountId ? (
                        <List.Item>
                           <List.Content as='h2'>{accountId}</List.Content>
                           <List.Content>@{accountId}</List.Content>
                        </List.Item>
                     ) : (
                        <List.Item>
                           <List.Content>
                              <Header as='h4' textAlign='left'>Enter a username to send:</Header>
                              <AccountFormAccountId
                                 formLoader={formLoader}
                                 handleChange={handleChange}
                                 defaultAccountId={accountId}
                              />
                              <Responsive as={RequestStatusBox} minWidth={768} requestStatus={requestStatus} />
                           </List.Content>
                        </List.Item>
                     )}
                     <List.Item className='amount border-top'>
                        <SendMoneyAmountInput 
                           handleChange={handleChange} 
                           defaultAmount={amount}
                        />
                     </List.Item>
                     {false ? (
                        <List.Item className='add-note border-bottom border-top'>
                           <TextArea
                              name='note'
                              value={note}
                              onChange={handleChange}
                              placeholder='Add a note...'
                           />
                        </List.Item>
                     ) : null}
               </List>
            </Fragment>
            <Fragment>
               <List className='list-bottom border'>
                  <List.Item className='send-money'>
                     <FormButton
                        onClick={handleNextStep}
                        color='green'
                        disabled={!isLegitForm()}
                     >
                        SEND MONEY
                     </FormButton>
                  </List.Item>
               </List>
            </Fragment>
         </MobileContainer>
      </Form>
   )
}

export default SendMoneyFirstStep
