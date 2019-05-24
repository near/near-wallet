import React from 'react'
import PropTypes from 'prop-types'
import { Container, Loader, Grid, Dimmer, Header } from 'semantic-ui-react'

import Disclaimer from '../common/Disclaimer'
import NearInfo from './NearInfo'

import styled from 'styled-components'

const CustomContainer = styled(Container)`
   &&& .creating-info {
      padding-right: 0px;
      padding-top: 48px;
      h1 {
         color: #4a4f54;
         padding-bottom: 24px;
      }
   }
   @media screen and (max-width: 767px) {
      &&& .creating-info {
         padding-right: 1rem;
      }
   }
`

/* eslint-disable jsx-a11y/accessible-emoji */
const RecoverAccountContainer = ({ loader, children }) => (
   <CustomContainer>
      <Grid>
         <Dimmer inverted active={loader}>
            <Loader />
         </Dimmer>

         <Grid.Row className='creating-info'>
            <Grid.Column computer={9} tablet={8} mobile={16}>
               <Header as='h1'>Recover your Account</Header>
               <Header as='h2'>
                  Please enter your account name and phone number you used to
                  protect account.
               </Header>
            </Grid.Column>
            <Grid.Column computer={7} tablet={8} mobile={16}>
               <NearInfo />
            </Grid.Column>
         </Grid.Row>
      </Grid>

      {children}

      <Disclaimer />
   </CustomContainer>
)

RecoverAccountContainer.propTypes = {
   loader: PropTypes.bool.isRequired,
   children: PropTypes.element.isRequired,
   location: PropTypes.object.isRequired
}

export default RecoverAccountContainer
