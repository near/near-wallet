import React from 'react'
import { Grid, Image, List } from 'semantic-ui-react'

import LogoFooterImage from '../../images/near.svg'
import NearkatImage from '../../images/footer-nearkat.svg'

import styled from 'styled-components'

const FooterGrid = styled(Grid)`
   position: absolute;
   bottom: 0px;
   width: 100%;

   height: 100px;
   background-color: #f8f8f8;

   font-size: 12px;
   font-weight: 300;
   line-height: 40px;
   color: #999999;

   &&& {
      margin-bottom: 0px;
      margin-left: 0px;
   }

   .near-logo {
      margin: 0 20px 0 0;
   }

   &&&& .help {
      padding-right: 0px;
      padding-top: 10px;
      padding-bottom: 0px;

      > .list {
         width: 230px;
         height: 80px;
         padding: 20px 0;
         background: #fff;
         text-align: left;

         > img {
            width: 80px;
            position: absolute;
            bottom: 0px;
            right: 200px;
         }

         > h3 {
            font-weight: 600 !important;
            padding: 0 0 0 40px;
            color: #999999 !important;

            &.color {
               color: #0072ce !important;
            }
         }
      }
   }
`

const ResponsiveContainer = () => (
   <FooterGrid columns={2}>
      <Grid.Column
         textAlign='left'
         verticalAlign='middle'
         computer={10}
         tablet={10}
         mobile={16}
      >
         <Image className='near-logo' src={LogoFooterImage} align='left' />©
         2019 NEAR Inc. All Rights Reserved.
      </Grid.Column>
      <Grid.Column
         only='tablet computer'
         computer={6}
         tablet={6}
         textAlign='right'
         className='help'
      >
         <List floated='right' className=''>
            <List.Item as='h3'>Need Help?</List.Item>
            <List.Item as='h3' className='color'>
               <a href='https://discordapp.com/invite/gBtUFKR'>
                  Contact Support
               </a>
            </List.Item>
            <Image className='nearkat' src={NearkatImage} />
         </List>
      </Grid.Column>
   </FooterGrid>
)

export default ResponsiveContainer
