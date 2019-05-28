import React from 'react'
import PropTypes from 'prop-types'
import { Container, Loader, Grid, Dimmer, Header } from 'semantic-ui-react'

import Disclaimer from '../common/Disclaimer'
import NearInfo from './NearInfo'

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
      h2 {
         color: #4a4f54 !important;
      }
   }

   @media screen and (max-width: 767px) {
      &&& .page-title {
         padding-top: 14px;
         text-align: center;

         .column {
            padding: 0 0 6px 0;
         }
         h1 {
            margin-bottom: 0px;
         }
         h2 {
            font-size: 16px !important;
            line-height: 22px !important;
            color: #999 !important;
         }
         .column.add {
            text-align: left;
            padding-top: 0px !important;
         }
      }
   }
`

/* eslint-disable jsx-a11y/accessible-emoji */
const SetRecoveryInfoContainer = ({ loader, children }) => (
   <CustomContainer>
      <Grid stackable>
         <Dimmer inverted active={loader}>
            <Loader />
         </Dimmer>

         <Grid.Row columns='2' className='page-title'>
            <Grid.Column computer={9} tablet={8} mobile={16}>
               <Header as='h1'>Protect your Account</Header>
               <Header as='h2'>
                  Enter your phone number to make your account easy for you to
                  recover in the future.
               </Header>
            </Grid.Column>
            <Grid.Column computer={7} tablet={8} mobile={16} className='add'>
               <NearInfo />
            </Grid.Column>
         </Grid.Row>
      </Grid>
      {children}
      <Disclaimer />
   </CustomContainer>
)
SetRecoveryInfoContainer.propTypes = {
   loader: PropTypes.bool.isRequired,
   children: PropTypes.element.isRequired,
   location: PropTypes.object.isRequired
}
export default SetRecoveryInfoContainer
