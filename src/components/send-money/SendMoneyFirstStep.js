import React from 'react'

import {
   Header,
   TextArea,
   List,
   Image,
   Button,
   Form,
   Dimmer,
   Loader,
} from 'semantic-ui-react'

import RequestStatusBox from '../common/RequestStatusBox'
import AccountFormAccountId from '../accounts/AccountFormAccountId'
import SendMoneyAmountInput from './SendMoneyAmountInput'

import AccountGreyImage from '../../images/icon-account-grey.svg'

import styled from 'styled-components'

const CustomList = styled(List)`
   &&&&& {
      padding: 24px;
      width: 360px;
      text-align: center;
      margin: 36px auto 0 auto;
      form {
         h3 {
            margin-bottom: 13px;
            text-align: left;
         }
         .alert-info {
            margin: 0 0 0 0;
            padding: 8px 0;
            line-height: 34px;
            font-size: 14px;
         }
         .main-image {
            border: 0px;
            padding: 0 10px;
            width: 48px;
            height: 48px;
            background: #e6e6e6;
            border-radius: 32px;
            margin: 0 auto;
            img {
               padding-top: 10px;
            }
         }
         .amount {
            margin-top: 16px;
            margin-bottom: 0px;
            padding-top: 24px;
         }
         .add-note {
            > textarea {
               width: 100%;
               border: 0px;
               padding: 12px;
               :focus {
                  border: 0px;
               }
            }
         }
         .send-money {
            margin-top: 24px;
            margin-bottom: 6px;
            > button {
               width: 288px;
               line-height: 56px;
               border-radius: 30px;
               border: solid 2px #5ace84;
               font-size: 18px;
               font-weight: 600;
               letter-spacing: 2px;
               text-align: center;
               padding: 0 0 0 0;
               background-color: #5ace84;
               color: #fff;
               :hover {
                  color: #5ace84;
                  background: #fff;
               }
               :disabled {
                  background-color: #e6e6e6;
                  border-color: #e6e6e6;
                  opacity: 1 !important;
               }
            }
         }
      }
      @media screen and (max-width: 991px) {
      }
      @media screen and (max-width: 767px) {
         padding: 0px;
         width: 100%;
         text-align: center;
         margin-left: auto;
         margin-right: auto;
         border: 0px;
         form {
            .add-note {
               margin-left: -1rem;
               margin-right: -1rem;
               > textarea {
                  width: 100%;
                  height: 98px;
                  border: 0px;
                  padding: 12px;
                  background: #f8f8f8;
                  :focus {
                     border: 0px;
                  }
               }
            }
         }
      }
   }
`

const SendMoneyFirstStep = ({
   handleNextStep,
   handleChange,
   note,
   loader,
   paramAccountId,
   accountId,
   isLegitForm,
   formLoader,
   requestStatus,
   amount
}) => (
   <CustomList className='box'>
      <Form autoComplete='off'>
         <Dimmer inverted active={loader}>
            <Loader />
         </Dimmer>

         {paramAccountId ? (
            <List.Item>
               <List.Content>
                  <div className='main-image'>
                     <Image src={AccountGreyImage} align='left' />
                  </div>
               </List.Content>
               <List.Content as='h2'>{accountId}</List.Content>
               <List.Content>@{accountId}</List.Content>
            </List.Item>
         ) : (
            <List.Item>
               <List.Content>
                  <Header as='h3'>Enter a username to send:</Header>
                  <AccountFormAccountId
                     formLoader={formLoader}
                     handleChange={handleChange}
                     defaultAccountId={accountId}
                  />
                  <RequestStatusBox requestStatus={requestStatus} />
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
         <List.Item className='send-money'>
            <Button
               disabled={!isLegitForm()}
               onClick={handleNextStep}
            >
               SEND MONEY
            </Button>
         </List.Item>
      </Form>
   </CustomList>
)

export default SendMoneyFirstStep
