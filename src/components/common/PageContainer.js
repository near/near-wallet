import React from 'react'

import { Container, Grid, Segment } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomContainer = styled(Container)`
   &&& {
      .page-title {
         border-bottom: 2px solid #e6e6e6;
         padding: 36px 0 36px 0;
         word-wrap: break-word;
         margin-bottom: 24px;

         h1 {
            line-height: 48px;
         }
         button {
            margin-top: 0px;
         }
         .column {
            padding-left: 0;
         }
         .add {
            text-align: right;
            padding-right: 0;
         }
      }
   }
   @media screen and (max-width: 991px) {
      &&& {
         .page-title {
            padding: 36px 0 24px 0;
            text-align: center;

            .column {
               padding: 0 0 12px 0;
            }
            .balance {
               display: none;
            }
            .add {
               text-align: center;

               h1 {
                  font-size: 12px !important;
                  line-height: 18px !important;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                  padding-bottom: 18px;
               }
            }
         }
      }
   }
   @media screen and (max-width: 767px) {
      &&& {
         .title-section {
            margin-left: 0;
            margin-right: 0;

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
      }
   }
   @media screen and (max-width: 479px) {
      h1 {
         font-size: 30px !important;
      }
   }
`

const PageContainer = ({ children, title, additional, bottom, type }) => (
   <CustomContainer>
      <Grid className='title-section'>
         {type === 'center'
            ? (
               <Grid.Row columns='1' className='page-title'>
                  <Grid.Column as='h1' textAlign='center'>
                     {title}
                  </Grid.Column>
               </Grid.Row>
            ) : (
               <Grid.Row columns='2' className='page-title'>
                  <Grid.Column as='h1' computer={11} tablet={16} mobile={16} verticalAlign='middle'>
                     {title}
                  </Grid.Column>
                  <Grid.Column computer={5} tablet={16} mobile={16} className='add'>
                     {additional}
                  </Grid.Column>
               </Grid.Row>
            )}
      </Grid>
      {children}
      <Segment basic textAlign='center'>
         {bottom}
      </Segment>
   </CustomContainer>
)

export default PageContainer
