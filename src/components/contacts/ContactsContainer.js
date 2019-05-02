import React from 'react'
import { Link } from 'react-router-dom'

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

   @media screen and (max-width: 991px) {
   }

   @media screen and (max-width: 767px) {
      &&& .creating-info {
         padding-left: 1rem;
         padding-right: 1rem;
      }
   }
`

const ContactsContainer = ({ children }) => (
   <CustomContainer>
      <Grid columns={2} className='creating-info'>
         <Grid.Column computer={12} tablet={10} mobile={16}>
            <Header as='h1'>Contacts</Header>
         </Grid.Column>
         <Grid.Column computer={4} tablet={6} mobile={16}>
            <Header as='h1' textAlign='right' className='color-black'>
               203<span className='color-brown-grey'> total</span>
            </Header>
         </Grid.Column>
      </Grid>

      {children}
   </CustomContainer>
)

export default ContactsContainer
