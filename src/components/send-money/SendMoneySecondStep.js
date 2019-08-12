import React from 'react'

import { List, Header } from 'semantic-ui-react'

import MainImage from '../common/MainImage'
import FormButton from '../common/FormButton'
import Balance from '../common/Balance'

import AccountGreyImage from '../../images/icon-account-grey.svg'
import milli from '../../images/n-1000.svg'

import styled from 'styled-components'

const CustomList = styled(List)`
   &&& {
      padding: 24px;
      width: 360px;
      text-align: center;
      margin: 24px auto 0 auto;

      
      .main-image > div {
         margin-left: auto;
         margin-right: auto;
      }
      .amount {
         margin-top: 0;
         margin-bottom: 0px;
         padding-top: 0px;
         padding-bottom: 24px;

         font-family: Bw Seido Round;
         font-size: ${props => props.fontSize}px;
         font-weight: 500;
         line-height: 60px;
         color: #4a4f54;
         word-break: break-all;
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
            font-weight: 600;

            :hover {
               text-decoration: underline;
            }
         }
      }

      .goback {
         font-weight: 600;
         margin-top: 12px;
         padding-top: 24px;

         button.link {
            background-color: transparent;
            border: none;
            cursor: pointer;
            text-decoration: none;
            display: inline;
            margin: 0;
            padding: 0;
            color: #0072ce;

            :hover,
            :focus {
               text-decoration: underline;
               color: #0072ce;
            }
         }
      }

      .send-money {
         padding-top: 0px;
         padding-bottom: 0px;
         margin-top: 24px;
         margin-bottom: 12px;
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
   handleNextStep,
   handleExpandNote,
   handleGoBack,
   expandNote,
   note,
   amount,
   accountId,
   loader
}) => (
   <CustomList className='box' fontSize={amount.toString().length > 8 ? 34 : 48}>
      <List.Item as='h2' >You are sending</List.Item>
      <List.Item className='amount border-bottom'>
         {(amount && milli) ? <Balance 
            milli={milli}
            amount={amount} /> : "NaN"}
      </List.Item>
      <List.Item className='to'>
         <Header as='h2'>to</Header>
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
      <List.Item>Once confirmed, this is not undoable.</List.Item>
      <List.Item className='goback border-top'>
         <FormButton
            onClick={handleGoBack}
            color='link bold'
            disabled={loader}
         >
            Need to edit? Go Back
         </FormButton>
      </List.Item>
   </CustomList>
)

export default SendMoneySecondStep
