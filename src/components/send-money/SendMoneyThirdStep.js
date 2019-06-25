import React from 'react'

import { List, Image } from 'semantic-ui-react'

import AccountGreyImage from '../../images/icon-account-grey.svg'
import SendImage from '../../images/icon-send.svg'

import styled from 'styled-components'

const CustomList = styled(List)`
   &&& {
      padding: 24px;
      width: 360px;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      margin-top: 12px;

      .send-money img {
         width: 24px;
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
         margin-top: 32px;
         margin-bottom: 0px;
         padding-top: 12px;
         padding-bottom: 24px;
      }

      .with-note {
         padding-top: 24px;
      }

      @media screen and (max-width: 991px) {
      }

      @media screen and (max-width: 767px) {
         &&& {
            padding: 0px;
            width: 100%;
            text-align: center;
            margin-left: auto;
            margin-right: auto;

            border: 0px;

            .send-money img {
               margin-top: 12px;
            }
            .amount {
               padding-top: 0px;
            }
         }
      }
   }
`

const SendMoneyThirdStep = ({ note, amount, accountId }) => (
   <CustomList>
      <List.Item className='send-money'>
         <Image src={SendImage} />
      </List.Item>
      <List.Item as='h2' className='amount'>
         {amount.toLocaleString('en', {useGrouping:true})}
         <span>Ⓝ</span> was sent to:
      </List.Item>
      <List.Item>
         <div className='main-image'>
            <Image src={AccountGreyImage} align='left' />
         </div>
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
   </CustomList>
)

export default SendMoneyThirdStep
