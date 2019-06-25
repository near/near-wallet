import React from 'react'

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
         margin-top: 24px;
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
         padding-top: 24px;
         padding-bottom: 0px;
         margin-top: 24px;
         margin-bottom: 12px;

         > .button {
            width: 288px;
            line-height: 60px;
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
               border-color: #e6e6e6;
               background: #e6e6e6;
               opacity: 1 !important;
            }
            :active,
            :focus {
               background: #fff;
               color: #5ace84;
            }

            &.dots {
               color: #fff;
               border-color: #cccccc;
               background-color: #cccccc;

               :after {
                  content: '.';
                  animation: dots 1s steps(5, end) infinite;
               
                  @keyframes dots {
                     0%, 20% {
                        color: rgba(0,0,0,0);
                        text-shadow:
                           .3em 0 0 rgba(0,0,0,0),
                           .6em 0 0 rgba(0,0,0,0);
                     }
                     40% {
                        color: white;
                        text-shadow:
                           .3em 0 0 rgba(0,0,0,0),
                           .6em 0 0 rgba(0,0,0,0);
                     }
                     60% {
                        text-shadow:
                           .3em 0 0 white,
                           .6em 0 0 rgba(0,0,0,0);
                     }
                     80%, 100% {
                        text-shadow:
                           .3em 0 0 white,
                           .6em 0 0 white;
                     }
                  }
               }
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
         {amount}
         <span>Ⓝ</span>
      </List.Item>
      <List.Item className='to'>
         <Header as='h2'>to</Header>
      </List.Item>
      <List.Item>
         <div className='main-image'>
            <Image src={AccountGreyImage} align='left' />
         </div>
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
         <Button onClick={handleNextStep} className={loader ? `dots` : ``} disabled={loader}>
            {loader
               ? `SENDING`
               : `CONFIRM & SEND`
            }
            
         </Button>
      </List.Item>
      <List.Item>Once confirmed, this is not undoable.</List.Item>
      <List.Item className='goback border-top'>
         <Button disabled={loader} className='link' onClick={handleGoBack}>
            Need to edit? Go Back
         </Button>
      </List.Item>
   </CustomList>
)

export default SendMoneySecondStep
