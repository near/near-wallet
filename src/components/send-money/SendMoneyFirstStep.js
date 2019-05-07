import React from 'react'

import { TextArea, List, Image, Button } from 'semantic-ui-react'

import AccountGreyImage from '../../images/icon-account-grey.svg'

import styled from 'styled-components'

const CustomList = styled(List)`
   &&& {
      padding: 24px;
      width: 360px;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      margin-top: 36px;

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
      }
      .near-tokens {
         padding-bottom: 36px;

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
         }
      }

      @media screen and (max-width: 991px) {
      }

      @media screen and (max-width: 767px) {
         .near-tokens {
            > button {
               width: 200px;
            }
         }

         &&& {
            padding: 0px;
            width: 100%;
            text-align: center;
            margin-left: auto;
            margin-right: auto;

            border: 0px;
         }
      }
   }
`

const SendMoneyFirstStep = ({ handleNextStep, handleChange, note }) => (
   <CustomList className='box'>
      <List.Item>
         <div className='main-image'>
            <Image src={AccountGreyImage} className='' align='left' />
         </div>
      </List.Item>
      <List.Item as='h2'>Alex Skidanov</List.Item>
      <List.Item>@alex.near</List.Item>
      <List.Item className='amount border-top'>1.345</List.Item>
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
         <Button onClick={handleNextStep}>SEND MONEY</Button>
      </List.Item>
   </CustomList>
)

export default SendMoneyFirstStep
