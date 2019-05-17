import React from 'react'

import { Container, Grid } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomContainer = styled(Container)`
   &&& .creating-info {
      padding-right: 0px;
      padding-top: 48px;
      padding-bottom: 0px;

      .column {
         padding: 0 0 24px 0;

         :first-child {
            padding-left: 0px;
         }
      }

      h1 {
         color: #4a4f54;
         padding-left: 0px;
         line-height: 48px;
      }
   }

   &&& .page-title {
      padding-right: 0px;
      padding-top: 48px;
      padding-bottom: 0px;

      .column {
         padding: 0 0 24px 0;
      }
      h1 {
         line-height: 48px;
      }
      .add {
         color: #24272a;
      }
   }

   @media screen and (max-width: 991px) {
   }

   @media screen and (max-width: 767px) {
      &&& .creating-info {
         padding-left: 1rem;
         padding-right: 1rem;
      }

      &&& .page-title {
         padding-top: 14px;
         text-align: center;

         .column {
            padding: 0 0 6px 0;
            width: 100% !important;
            float: none;
         }
         .add {
            font-size: 12px !important;
            line-height: 18px !important;
            letter-spacing: 2px;
            text-transform: uppercase;

            padding-bottom: 18px;
         }
      }
   }
`

const SendMoneyContainer = ({ children, step }) => (
   <CustomContainer>
      <Grid>
         <Grid.Row columns='1' className='page-title'>
            <Grid.Column as='h1' textAlign='center'>
               {step === 3 ? `Success!` : `Send Money`}
            </Grid.Column>
         </Grid.Row>
      </Grid>
      {children}
   </CustomContainer>
)

export default SendMoneyContainer
