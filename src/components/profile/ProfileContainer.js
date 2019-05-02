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

   @media screen and (max-width: 767px) {
      > .grid {
         margin-left: 0px;
         margin-right: 0px;
      }
   }
`

const ProfileContainer = ({ children }) => (
   <CustomContainer>
      <Grid>
         <Grid.Row className='creating-info'>
            <Grid.Column computer={12} tablet={11} mobile={16}>
               <Header as='h1'>
                  Account: <span className='color-black'>@eugenethedream</span>
               </Header>
            </Grid.Column>
         </Grid.Row>
      </Grid>
      {children}
   </CustomContainer>
)

export default ProfileContainer
