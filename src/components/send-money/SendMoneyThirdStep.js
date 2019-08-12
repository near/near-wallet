import React from 'react'

import { List, Image } from 'semantic-ui-react'

import MainImage from '../common/MainImage'
import Balance from '../common/Balance'

import AccountGreyImage from '../../images/icon-account-grey.svg'
import SendImage from '../../images/icon-send.svg'
import milli from '../../images/n-1000.svg'

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
      .main-image > div {
         margin-left: auto;
         margin-right: auto;
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
         {(amount && milli) ? <Balance
            milli={milli}
            amount={amount} /> : "NaN"}
            <span>was sent to:</span>
      </List.Item>
      <List.Item className='main-image'>
         <MainImage
            src={AccountGreyImage}
            size='medium'
         />
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
