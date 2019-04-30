import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Responsive } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomGrid = styled(Grid)`
   && .username-row {
      padding-bottom: 0px;
   }

   &&& .alert-info {
      font-size: 18px;
      font-weight: 600;
      line-height: 64px;
      margin: 0 0 0 0;
      padding-left: 0px;

      &.problem {
         color: #ff585d;
      }
      &.success {
         color: #6ad1e3;
      }
   }

   .note-box {
      padding-left: 30px;

      .border-left-bold {
         padding-bottom: 20px;
      }
   }

   &&& .note-info {
      letter-spacing: 2px;
      font-weight: 600;
      line-height: 20px;
      color: #4a4f54;
   }

   @media screen and (max-width: 991px) {
      .note-box {
         padding-left: 0px;
      }
   }

   @media screen and (max-width: 767px) {
      &&& .alert-info {
         padding: 0 0 0 24px;
         line-height: 34px;
         font-size: 14px;
      }

      .note-box {
         padding-left: 1rem;
         margin-top: 10px;
      }

      .note-box {
         .border-left-bold {
            padding-bottom: 0px;
         }
      }
   }
`

const SetRecoveryInfoSection = ({ successMessage, errorMessage, children }) => (
   <CustomGrid className=''>
      <Grid.Row className='username-row'>
         <Grid.Column
            as='h3'
            computer={16}
            tablet={16}
            mobile={16}
            className=''
         >
            Phone Number
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className=''>
         <Grid.Column computer={8} tablet={8} mobile={16} className=''>
            {children}
         </Grid.Column>
         <Grid.Column computer={8} tablet={8} mobile={16}>
            <Grid className='note-box'>
               {successMessage && (
                  <Responsive
                     as={Grid.Row}
                     minWidth={Responsive.onlyTablet.minWidth}
                  >
                     <Grid.Column className='alert-info success'>
                        TODO: Message to wait for SMS
                     </Grid.Column>
                  </Responsive>
               )}
               {errorMessage && (
                  <Responsive
                     as={Grid.Row}
                     minWidth={Responsive.onlyTablet.minWidth}
                  >
                     <Grid.Column className='alert-info problem'>
                        TODO: Show error message
                     </Grid.Column>
                  </Responsive>
               )}
            </Grid>
         </Grid.Column>
      </Grid.Row>
   </CustomGrid>
)

SetRecoveryInfoSection.propTypes = {
   successMessage: PropTypes.bool.isRequired,
   errorMessage: PropTypes.bool.isRequired,
   children: PropTypes.element.isRequired
}

export default SetRecoveryInfoSection
