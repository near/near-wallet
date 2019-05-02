import React from 'react'
import { Link } from 'react-router-dom'

import ArrowRightImage from '../../images/icon-arrow-right.svg'

import { TextArea, List, Image, Grid, Button, Header } from 'semantic-ui-react'

import AccountGreyImage from '../../images/icon-account-grey.svg'

import styled from 'styled-components'

const CustomList = styled(List)`
   &&& {
      padding: 24px;

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
         padding-bottom: 24px;

         .expand-note {
            color: #0072ce;
            cursor: pointer;

            :hover {
               text-decoration: underline;
            }
         }
      }

      .send-money {
         margin-top: 24px;
         padding-bottom: 24px;
         margin-bottom: 24px;

         > .button {
            width: 90%;
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
            margin: -14px auto 12px auto;
         }
      }
   }
`

const SendMoneySecondStep = ({ handleExpandNote, expandNote, note }) => (
   <CustomList className='box'>
      <List.Item as='h2'>You are sending</List.Item>
      <List.Item as='h1' className='amount border-bottom'>
         1.345
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
      <List.Item as='h2'>Alex Skidanov</List.Item>
      <List.Item>@alex.near</List.Item>
      {note && (
         <List.Item className='with-note border-bottom'>
            with note -{' '}
            {expandNote ? (
               <span className='color-black'>{note}</span>
            ) : (
               <span className='expand-note' onClick={handleExpandNote}>
                  Expand note
               </span>
            )}
         </List.Item>
      )}
      <List.Item as='' className='send-money border-bottom'>
         <Button as={Link} to='/contacts'>
            CONFIRM & SEND
         </Button>
      </List.Item>
      <List.Item>Once confirmed, this is not undoable.</List.Item>
   </CustomList>
)

export default SendMoneySecondStep
