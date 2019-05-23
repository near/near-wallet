import React from 'react'
import PropTypes from 'prop-types'
import { Grid, List, Responsive } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomGrid = styled(Grid)`
   &&& {
      .username-row {
         padding-bottom: 0px;
         margin-left: -1rem;
      }

      .alert-info {
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

      .note-info {
         .title {
            letter-spacing: 2px;
            font-weight: 600;
            line-height: 20px;
            color: #4a4f54;
         }
      }

      .form-row {
         margin-left: -1rem;
      }
   }

   @media screen and (max-width: 991px) {
      .note-box {
         padding-left: 0px;
      }
   }

   @media screen and (max-width: 767px) {
      &&& {
         .username-row {
            margin-left: 0;
         }

         .alert-info {
            padding: 0 0 6px 24px;
            line-height: 34px;
            font-size: 14px;
            margin-top: -6px;
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

         .form-row {
            padding-top: 6px;
            margin-left: 0;
         }

         &&& .note-info {
            font-size: 12px;
         }
      }
   }
`

const CreateAccountSection = ({ successMessage, errorMessage, children }) => (
   <CustomGrid>
      <Grid.Row className='username-row'>
         <Grid.Column as='h3' computer={16} tablet={16} mobile={16}>
            Choose a Username
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='form-row'>
         <Grid.Column computer={8} tablet={8} mobile={16}>
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
                        Congrats! this name is available.
                     </Grid.Column>
                  </Responsive>
               )}
               {errorMessage && (
                  <Responsive
                     as={Grid.Row}
                     minWidth={Responsive.onlyTablet.minWidth}
                  >
                     <Grid.Column className='alert-info problem'>
                        Username is taken. Try something else.
                     </Grid.Column>
                  </Responsive>
               )}

               <Grid.Row>
                  <Grid.Column className='border-left-bold'>
                     <List className='note-info'>
                        <List.Item className='title'>NOTE</List.Item>
                        <List.Item>
                           Your username can be 5-32 characters
                        </List.Item>
                        <List.Item>
                           long and contain any of the following:
                        </List.Item>
                        <List.Item>• Lowercase characters (a-z)</List.Item>
                        <List.Item>• Digits (0-9)</List.Item>
                        <List.Item>• Special characters (@._-)</List.Item>
                     </List>
                  </Grid.Column>
               </Grid.Row>
            </Grid>
         </Grid.Column>
      </Grid.Row>
   </CustomGrid>
)

CreateAccountSection.propTypes = {
   successMessage: PropTypes.bool.isRequired,
   errorMessage: PropTypes.bool.isRequired,
   children: PropTypes.element.isRequired
}

export default CreateAccountSection
