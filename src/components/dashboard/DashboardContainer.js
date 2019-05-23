import React from 'react'
import { Link } from 'react-router-dom'

import DashboardOtherAssets from './DashboardOtherAssets'

import ArrowGrnImage from '../../images/icon-arrow-grn.svg'
import ArrowRightImage from '../../images/icon-arrow-right.svg'

import { Container, Grid, Button, Header } from 'semantic-ui-react'

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

   .near {
      font-size: 48px;
      color: #24272a;
   }

   &&& .send-money {
      margin: -8px 0 0 0;

      > .button {
         width: 100%;
         line-height: 60px;
         border-radius: 30px;
         border: solid 2px #5ace84;
         font-size: 18px;
         font-weight: 600;
         letter-spacing: 2px;
         color: #5ace84;
         background: #fff;
         text-align: left;
         padding: 0 0 0 40px;

         background-image: url(${ArrowGrnImage});
         background-repeat: no-repeat;
         background-position: 90% center;
         background-size: 14px 20px;

         :hover {
            background-color: #5ace84;
            color: #fff;
            background-image: url(${ArrowRightImage});
         }
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
      }

      &&& .creating-info {
         text-align: center;

         .column {
            padding: 0 0 12px 0;
         }
         .balance {
            display: none;
         }
         .button {
            width: 240px;
            line-height: 44px;
         }
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

      &&& .creating-info {
         padding-top: 24px;
         text-align: center;

         .column {
            padding: 0 0 12px 0;
         }
         .balance {
            display: none;
         }
         .button {
            width: 240px;
            line-height: 44px;
         }
      }
   }
`

const DashboardContainer = ({ children, account }) => (
   <CustomContainer>
      <Grid>
         <Grid.Row className='creating-info'>
            <Grid.Column
               computer={12}
               tablet={16}
               mobile={16}
               verticalAlign='middle'
            >
               <Header as='h1'>
                  <span className='balance'>Balance: </span>
                  <span className='color-black'>{account.amount}</span>
                  <span className='near'>Ⓝ</span>
               </Header>
            </Grid.Column>
            <Grid.Column
               computer={4}
               tablet={16}
               mobile={16}
               className='send-money'
            >
               <Button as={Link} to='/send-money'>
                  SEND MONEY
               </Button>
            </Grid.Column>
         </Grid.Row>
      </Grid>
      { false ?
      <DashboardOtherAssets />
      : null }
      {children}
   </CustomContainer>
)

export default DashboardContainer
