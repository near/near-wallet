import React from 'react'
import { Link } from 'react-router-dom'

import FormButton from '../common/FormButton'
import DashboardOtherAssets from './DashboardOtherAssets'

import { Container, Grid } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomContainer = styled(Container)`
   &&& .page-title {
      padding-right: 0px;
      padding-top: 48px;
      padding-bottom: 0px;
      word-wrap: break-word;

      .column {
         padding: 0 14px 24px 0;
      }
      h1 {
         line-height: 48px;
      }
      .add {
         text-align: right;
      }
   }
   .near {
      font-size: 48px;
      color: #24272a;
   }
   &&& .send-money {
      button {
         float: right;
         margin: 0 0 0 0 !important;
      }
   }
   &&& {
      .right-section {
         padding-left: 40px;
      }
   }
   @media screen and (max-width: 991px) {
      > .grid {
         margin-left: 0px;
         margin-right: 0px;
      }
      &&& .send-money {
         margin-top: 20px;
         margin-top: 0px;

         .button {
            float: none;
         }
      }
      &&& .page-title {
         text-align: center;
         .column {
            padding: 0 0 12px 0;
         }
         .balance {
            display: none;
         }
      }
      .near {
         font-size: 38px;
         color: #24272a;
      }
   }
   @media screen and (max-width: 767px) {
      > .grid {
         margin-left: 0px;
         margin-right: 0px;
      }
      &&& .send-money {
         margin-top: 20px;
         margin-top: 0px;
      }
      &&& .page-title {
         padding-top: 24px;
         text-align: center;
         .column {
            padding: 0 0 12px 0;
         }
         .balance {
            display: none;
         }
      }
   }
   @media screen and (max-width: 479px) {
      h1 {
         font-size: 30px !important;
      }
      .near {
         font-size: 30px;
         color: #24272a;
      }
   }
   
`

const DashboardContainer = ({ children, amountStr }) => (
   <CustomContainer>
      <Grid>
         <Grid.Row columns='2' className='page-title'>
            <Grid.Column
               as='h1'
               computer={11}
               tablet={16}
               mobile={16}
               verticalAlign='middle'
            >
               <span className='balance'>Balance: </span>
               <span className='color-black'>{amountStr}</span>
               <span className='near'>Ⓝ</span>
            </Grid.Column>
            <Grid.Column
               computer={5}
               tablet={16}
               mobile={16}
               className='send-money'
            >
               <Link to='/send-money'>
                  <FormButton color='green-white-arrow' >
                     SEND MONEY
                  </FormButton>
               </Link>
            </Grid.Column>
         </Grid.Row>
      </Grid>
      {false ? <DashboardOtherAssets /> : null}
      {children}
   </CustomContainer>
)

export default DashboardContainer
