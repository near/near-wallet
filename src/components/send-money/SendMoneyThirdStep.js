import React, { Fragment } from 'react'

import { List } from 'semantic-ui-react'

import PageContainer from '../common/PageContainer';
import MobileContainer from '../sign/MobileContainer'
import Balance from '../common/Balance'
import SignAnimatedArrow from '../sign/SignAnimatedArrow'
import FormButton from '../common/FormButton'

const SendMoneyThirdStep = ({ handleRedirectDashboard, note, amount, accountId }) => (
   <MobileContainer>
      <Fragment>
         <PageContainer
            title={`Success!`}
            type='center'
         />
         <List className='list-top'>
            <List.Item className='send-money'>
               <SignAnimatedArrow />
            </List.Item>
            <List.Item as='h2' className='amount-sent'>
               {amount 
               ? <Balance amount={amount} /> 
               : "NaN"}
                  <span> was sent to:</span>
            </List.Item>
            <List.Item as='h2'>{accountId}</List.Item>
            <List.Item>@{accountId}</List.Item>
            {note && (
               <List.Item className='with-note'>
                  <span className='font-bold'>with note:</span>
                  <br />
                  {note}
               </List.Item>
            )}
         </List>
      </Fragment>
      <Fragment>
         <List className='list-bottom go-to-dashboard'>
            <FormButton
               onClick={handleRedirectDashboard}
               color='seafoam-blue'
            >
               GO TO DASHBOARD
            </FormButton>
         </List>
      </Fragment>
   </MobileContainer>
)

export default SendMoneyThirdStep
