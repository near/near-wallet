import React from 'react'

import { Container, Grid } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomContainer = styled(Container)`
   &&& .page-title {
      padding-right: 0px;
      padding-top: 48px;
      padding-bottom: 0px;

      .column {
         padding: 0 14px 24px 0;
      }
      h1 {
         line-height: 48px;
      }
      .add {
         color: #24272a;
         text-align: right;
      }
   }

   @media screen and (max-width: 767px) {
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
            text-align: center;
         }
      }
   }
`

const ContactsContainer = ({ children }) => (
   <CustomContainer>
      <Grid>
         <Grid.Row columns='2' className='page-title'>
            <Grid.Column computer='10' tablet='10' mobile='16' as='h1'>
               Contacts
            </Grid.Column>
            <Grid.Column
               computer='6'
               tablet='6'
               mobile='16'
               as='h1'
               className='add'
            >
               203<span className='color-brown-grey'> total</span>
            </Grid.Column>
         </Grid.Row>
      </Grid>

      {children}
   </CustomContainer>
)

export default ContactsContainer
