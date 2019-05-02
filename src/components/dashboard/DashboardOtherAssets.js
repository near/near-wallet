import React from 'react'

import TContractImage from '../../images/icon-t-contract.svg'

import { Grid, List } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomGrid = styled(Grid)`
   &&&& .other-assets {
      background: #f8f8f8;
      border-top: 2px solid #e6e6e6;
      border-bottom: 4px solid #e6e6e6;
      padding: 0px;

      .column {
         border-right: 2px solid #e6e6e6;
         padding: 10px 0px 10px 18px;

         :last-of-type {
            border: 0px;
         }

         .icon {
            background-image: url(${TContractImage});
            background-repeat: no-repeat;
            background-position: center top;
            background-size: 24px 24px;
            width: 24px;
            height: 38px;
            margin: 0 6px 0 0;
         }

         h5 {
            font-weight: 600;
            line-height: 16px;
         }
      }
   }

   && .other-assets-title {
      padding-bottom: 6px;
      color: #24272a;
      font-weight: 600;
   }

   @media screen and (max-width: 767px) {
      &&&& .other-assets {
         > .column {
            width: 100% !important;
            border-right: 0px solid #e6e6e6;
            border-bottom: 1px solid #e6e6e6;
         }
      }
   }
`

const DashboardOtherAssets = () => (
   <CustomGrid>
      <Grid.Row className='other-assets-title' as='h6'>
         OTHER ASSETS
      </Grid.Row>
      <Grid.Row columns={6} className='other-assets'>
         <Grid.Column>
            <List horizontal>
               <List.Item>
                  <List.Icon />
                  <List.Content>
                     <List.Header as='h2' className='color-charcoal-grey'>
                        12.125
                     </List.Header>
                     <List.Description as='h5' className='color-brown-grey'>
                        ETH
                     </List.Description>
                  </List.Content>
               </List.Item>
            </List>
         </Grid.Column>
         <Grid.Column>
            <List horizontal>
               <List.Item>
                  <List.Icon />
                  <List.Content>
                     <List.Header as='h2' className='color-charcoal-grey'>
                        3.2501
                     </List.Header>
                     <List.Description as='h5' className='color-brown-grey'>
                        XRP
                     </List.Description>
                  </List.Content>
               </List.Item>
            </List>
         </Grid.Column>
         <Grid.Column>
            <List horizontal>
               <List.Item>
                  <List.Icon />
                  <List.Content>
                     <List.Header as='h2' className='color-charcoal-grey'>
                        8.0987
                     </List.Header>
                     <List.Description as='h5' className='color-brown-grey'>
                        ZEC
                     </List.Description>
                  </List.Content>
               </List.Item>
            </List>
         </Grid.Column>
         <Grid.Column>
            <List horizontal>
               <List.Item>
                  <List.Icon />
                  <List.Content>
                     <List.Header as='h2' className='color-charcoal-grey'>
                        13.258
                     </List.Header>
                     <List.Description as='h5' className='color-brown-grey'>
                        BNB
                     </List.Description>
                  </List.Content>
               </List.Item>
            </List>
         </Grid.Column>
         <Grid.Column>
            <List horizontal>
               <List.Item>
                  <List.Icon />
                  <List.Content>
                     <List.Header as='h2' className='color-charcoal-grey'>
                        2.5897
                     </List.Header>
                     <List.Description as='h5' className='color-brown-grey'>
                        XMR
                     </List.Description>
                  </List.Content>
               </List.Item>
            </List>
         </Grid.Column>
         <Grid.Column>
            <List horizontal>
               <List.Item>
                  <List.Icon />
                  <List.Content>
                     <List.Header as='h2' className='color-charcoal-grey'>
                        1.2589
                     </List.Header>
                     <List.Description as='h5' className='color-brown-grey'>
                        ZIL
                     </List.Description>
                  </List.Content>
               </List.Item>
            </List>
         </Grid.Column>
      </Grid.Row>
   </CustomGrid>
)

export default DashboardOtherAssets
