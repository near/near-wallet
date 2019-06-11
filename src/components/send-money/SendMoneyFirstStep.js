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
   Segment
} from 'semantic-ui-react'

import CreateAccoungFormInput from '../accounts/CreateAccoungFormInput'

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
            font-weight: 600;
            margin: 0 0 -8px 0;
            padding: 0 0 0 24px !important;
            line-height: 34px;
            font-size: 14px;
            margin-top: -6px;
            text-align: left;
            &.problem {
               color: #ff585d;
            }
            &.success {
               color: #6ad1e3;
            }
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
            
            input {
               height: 80px;
               border: 0px;
               font-family: Bw Seido Round;
               font-size: 72px;
               font-weight: 500;
               line-height: 80px;
               color: #4a4f54;
               text-align: center;
               padding: 0px;
               
               :focus::-webkit-input-placeholder { color: transparent; }
               :focus:-moz-placeholder { color: transparent; }
               :focus::-moz-placeholder { color: transparent; }
               :focus:-ms-input-placeholder { color: transparent; }

               -moz-appearance: textfield;

               ::-webkit-outer-spin-button,
               ::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
               }
            }


         }
         .near-tokens {
            margin: 14px auto 36px auto;
            text-align: center;
            padding: 2px;
            width: 200px;
            background-color: #fff;
            color: #999999;
            font-weight: 600;
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
         .near-tokens {
            width: 200px;
         }
         form {
            .near-tokens {
               margin: 14px auto 24px auto;
            }
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
   handleChangeAccountId,
   successMessage,
   errorMessage,
   formLoader,
   amount
}) => (
   <CustomList className='box'>
      <Form autoComplete='off' onSubmit={handleChangeAccountId}>
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

                  <CreateAccoungFormInput
                     formLoader={formLoader}
                     accountId={accountId}
                     handleChangeAccountId={handleChangeAccountId}
                     successMessage={successMessage}
                     errorMessage={errorMessage}
                  />

                  {successMessage && (
                     <Segment basic className='alert-info success'>
                        Username exists.
                     </Segment>
                  )}
                  {errorMessage && (
                     <Segment basic className='alert-info problem'>
                        Username does not exist.
                     </Segment>
                  )}
               </List.Content>
            </List.Item>
         )}

         <List.Item className='amount border-top'>
            <Form.Input
               type='number'
               name='amount'
               value={amount}
               onChange={handleChange}
               placeholder='0'
               step='1'
               min='1'
            />
         </List.Item>
         <List.Item as='h5' className='near-tokens'>
            NEAR TOKENS
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
               disabled={
                  paramAccountId
                     ? !(parseFloat(amount) > 0)
                     : !(successMessage && parseFloat(amount) > 0)
               }
               onClick={handleNextStep}
            >
               SEND MONEY
            </Button>
         </List.Item>
      </Form>
   </CustomList>
)

export default SendMoneyFirstStep
