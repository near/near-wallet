import React from 'react'
import { Grid, Image, List, Item } from 'semantic-ui-react'

import LogoFooterImage from '../../images/near.svg'
import NearkatImage from '../../images/footer-nearkat.svg'

import styled from 'styled-components'

const FooterGrid = styled(Grid)`
   &&&& {
      position: absolute;
      bottom: 0px;
      width: 100%;

      background-color: #f8f8f8;

      font-size: 12px;
      font-weight: 300;
      color: #999999;

      margin-bottom: 0px;
      margin-left: 0px;

      .near-logo {
         .content {
            a {
               font-size: 12px;
               font-weight: 300;
               color: #999999;
               text-decoration: underline;

               :hover {
                  text-decoration: none;
               }
            }
            .color-brown-grey {
               color: #e6e6e6;
               padding: 0 6px;
            }
         }
         .image {
            width: 140px;
            padding-left: 14px;

            img {
            }
         }
      }

      .learn-more {
         padding: 0 40px 0 0;
         color: #24272a;
      }

      .help {
         padding-right: 0px;
         padding-top: 10px;
         padding-bottom: 10px;

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
   }

   @media screen and (max-width: 991px) {
   }

   @media screen and (max-width: 767px) {
      &&& {
         height: 180px;

         .near-logo {
            .item {
            }
            .content {
               text-align: center;
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
         widescreen={4}
         largeScreen={6}
         computer={7}
         tablet={10}
         mobile={16}
      >
         <Item.Group className='near-logo'>
            <Item>
               <Item.Image src={LogoFooterImage} />
               <Item.Content>
                  © 2019 NEAR Inc. All Rights Reserved.
                  <br />
                  <a href='/'>Terms of Service</a>
                  <span className='color-brown-grey'>|</span>
                  <a href='/'>Privacy Policy</a>
               </Item.Content>
            </Item>
         </Item.Group>
      </Grid.Column>
      <Grid.Column
         only='computer'
         computer={5}
         className='learn-more'
         verticalAlign='middle'
      >
         NEAR is a scalable computing and storage platform that changes how the
         web works for better.{' '}
         <a href='https://nearprotocol.com/'>Learn More</a>
      </Grid.Column>
      <Grid.Column
         only='tablet computer'
         widescreen={7}
         largeScreen={5}
         computer={4}
         tablet={6}
         textAlign='right'
         className='help'
      >
         <List floated='right'>
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
