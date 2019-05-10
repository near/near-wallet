import React from 'react'
import { Link } from 'react-router-dom'

import { List, Image, Button, Header } from 'semantic-ui-react'

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
         margin-top: 0;
         margin-bottom: 0px;
         padding-top: 12px;
         padding-bottom: 24px;

         font-family: Bw Seido Round;
         font-size: 72px;
         font-weight: 500;
         line-height: 72px;
         color: #4a4f54;
      }
      .to {
         width: 40px;
         background: #fff;
         margin: -20px auto 12px auto;
      }

      .with-note {
         padding-top: 12px;

         .expand-note {
            color: #0072ce;
            cursor: pointer;

            :hover {
               text-decoration: underline;
            }
         }
      }

      .send-money {
         padding-top: 24px;
         padding-bottom: 24px;
         margin-top: 24px;
         margin-bottom: 24px;

         > .button {
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
         .to {
            margin: -20px auto 12px auto;
         }

         &&& {
            padding: 0px;
            width: 100%;
            text-align: center;
            margin-left: auto;
            margin-right: auto;

            border: 0px;

            .amount {
               font-size: 48px !important;
               padding-top: 0px;
            }
            .send-money {
               padding-top: 14px;
               padding-bottom: 14px;
               margin-top: 14px;
               margin-bottom: 14px;
            }
         }
      }
   }
`

const SendMoneySecondStep = ({
   handleExpandNote,
   expandNote,
   note,
   amount,
   accountId
}) => (
   <CustomList className='box'>
      <List.Item as='h2'>You are sending</List.Item>
      <List.Item as='h1' className='amount border-bottom'>
         {amount}
         <span>Ⓝ</span>
      </List.Item>
      <List.Item className='to'>
         <Header as='h2'>to</Header>
      </List.Item>
      <List.Item>
         <div className='main-image'>
            <Image src={AccountGreyImage} className='' align='left' />
         </div>
      </List.Item>
      <List.Item as='h2'>{accountId}</List.Item>
      <List.Item>@{accountId}</List.Item>
      {note && (
         <List.Item className='with-note '>
            with note:
            {expandNote ? (
               <span className='color-black'>{note}</span>
            ) : (
               <span className='expand-note' onClick={handleExpandNote}>
                  Expand note
               </span>
            )}
         </List.Item>
      )}
      <List.Item as='' className='send-money border-top border-bottom'>
         <Button as={Link} to='/contacts'>
            CONFIRM & SEND
         </Button>
      </List.Item>
      <List.Item>Once confirmed, this is not undoable.</List.Item>
   </CustomList>
)

export default SendMoneySecondStep
