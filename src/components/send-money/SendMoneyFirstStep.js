import React from 'react'

import {
   Input,
   Header,
   TextArea,
   List,
   Image,
   Button,
   Form,
   Dimmer,
   Loader
} from 'semantic-ui-react'

import AccountGreyImage from '../../images/icon-account-grey.svg'
import ProblemsImage from '../../images/icon-problems.svg'
import CheckBlueImage from '../../images/icon-check-blue.svg'

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

         input {
            width: 100%;
            height: 64px;
            border: 4px solid #f8f8f8;
            padding: 0 0 0 20px;

            font-size: 18px;
            color: #4a4f54;
            font-weight: 400;
            background: 0;

            position: relative;

            :focus {
               border-color: #6ad1e3;
            }
         }

         .spinner {
            margin-right: 20px;

            :before,
            :after {
               top: 28px;
               width: 24px;
               height: 24px;
            }
         }

         .problem > .input > input,
         .problem > .input > input:focus {
            background: url(${ProblemsImage}) right 22px center no-repeat;
            background-size: 24px 24px;
         }

         .success > .input > input,
         .success > .input > input:focus {
            background: url(${CheckBlueImage}) right 22px center no-repeat;
            background-size: 24px 24px;
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

         font-family: Bw Seido Round;
         font-size: 72px;
         font-weight: 500;
         line-height: 72px;
         color: #4a4f54;

         input {
            border: 0px;
            font-family: Bw Seido Round;
            font-size: 72px;
            font-weight: 500;
            line-height: 72px;
            color: #4a4f54;
            text-align: center;
            padding: 0px;
         }
      }
      .near-tokens {
         padding-top: 24px;
         padding-bottom: 36px;
         text-align: center;

         > button {
            width: 200px;
            background-color: #fff;
            border: 2px solid #e6e6e6;
            border-radius: 25px;
            color: #999999;
            font-weight: 600;

            :hover {
               background-color: #e6e6e6;
               color: #fff;
            }
         }
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
            line-height: 60px;
            border-radius: 30px;
            border: solid 2px #5ace84;
            font-size: 18px;
            font-weight: 500;
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
               opacity: 1;
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
            > button {
               width: 200px;
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
                     <Image src={AccountGreyImage} className='' align='left' />
                  </div>
               </List.Content>
               <List.Content as='h2'>{accountId}</List.Content>
               <List.Content>@{accountId}</List.Content>
            </List.Item>
         ) : (
            <List.Item>
               <List.Content>
                  <Header as='h3'>Enter a username to send:</Header>
                  <Form.Input
                     loading={formLoader}
                     className={`create ${successMessage ? 'success' : ''}${
                        errorMessage ? 'problem' : ''
                     }`}
                     name='accountId'
                     value={accountId}
                     onChange={handleChangeAccountId}
                     placeholder='example: satoshi.near'
                  />
               </List.Content>
            </List.Item>
         )}

         <List.Item className='amount border-top'>
            <Form.Input
               type='number'
               name='amount'
               value={amount}
               onChange={handleChange}
               placeholder='0.00'
               step='0.01'
               min='0'
            />
         </List.Item>
         <List.Item as='h5' className='near-tokens border-bottom'>
            <Button className=''>NEAR TOKENS</Button>
         </List.Item>
         <List.Item as='' className='add-note border-bottom'>
            <TextArea
               name='note'
               value={note}
               onChange={handleChange}
               placeholder='Add a note...'
            />
         </List.Item>
         <List.Item as='' className='send-money'>
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
