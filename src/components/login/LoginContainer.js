import React from 'react'
import PropTypes from 'prop-types'

import MainImage from '../common/MainImage'

import {
   Container,
   Loader,
   Grid,
   Dimmer,
   Image,
   List,
   Segment
} from 'semantic-ui-react'

import AccountGreyImage from '../../images/icon-account-grey.svg'
import CheckBlueImage from '../../images/icon-check-blue.svg'
import DenyImage from '../../images/icon-deny.svg'
import AppDefaultImage from '../../images/icon-app-default.svg'
import AuthorizeImage from '../../images/icon-authorize.svg'

import styled from 'styled-components'

const CustomContainer = styled(Container)`
   && .title {
      padding-top: 40px;
   }

   && .contract {
      padding-bottom: 40px;
   }

   &&& .authorize {
      margin-top: 40px;

      .md {
         > img {
            margin-top: -40px;
            padding: 0 24px;
         }
      }
   }

   && .cont {
      background: #f8f8f8;
      padding: 16px 0px;

      > div {
         padding: 20px 0 20px 50px;
      }
      img {
         height: 24px;
         margin-right: 6px;
      }
      div.item {
         padding-top: 24px;

         .content {
            line-height: 24px;
         }
      }
   }

   .list-item {
      background: url(${CheckBlueImage}) no-repeat left 24px;
      background-size: 24px 24px;

      > .content {
         padding-left: 32px;
      }
   }

   .list-item-deny {
      background: url(${DenyImage}) no-repeat left 24px;
      background-size: 24px 24px;

      > .content {
         padding-left: 32px;
      }
   }

   @media screen and (max-width: 991px) {
      && .cont {
         > div {
            padding: 20px 0 20px 20px;
         }
      }
   }

   @media screen and (max-width: 767px) {
      && .title {
         padding-top: 0px;

         h2 {
            font-size: 18px !important;
            line-height: 24px !important;
         }
      }

      && .contract {
         padding-top: 0px;
         padding-bottom: 20px;
      }

      && .cont {
         > div {
            border: 0px;
            padding: 10px 0 10px 0;

            h3 {
               font-size: 14px !important;
            }
         }

         div.item {
            padding-top: 24px;

            .content {
               font-size: 12px;
               line-height: 26px;
            }
         }
      }

      &&& .authorize {
         margin-top: 20px;
      }
   }
`

const LoginContainer = ({ loader, children, appTitle, contractId }) => (
   <CustomContainer>
      <Dimmer.Dimmable as={Segment} basic>
         <Grid>
            <Dimmer inverted active={loader}>
               <Loader />
            </Dimmer>

            <Grid.Row>
               <Grid.Column
                  textAlign='center'
                  computer={16}
                  tablet={16}
                  mobile={16}
               >
                  <List horizontal className='authorize'>
                     <List.Item>
                        <MainImage
                           src={AccountGreyImage} 
                           size='big'
                        />
                     </List.Item>
                     <List.Item className='md'>
                        <Image src={AuthorizeImage} />
                     </List.Item>
                     <List.Item>
                        <MainImage
                           src={AppDefaultImage} 
                           size='big'
                        />
                     </List.Item>
                  </List>
               </Grid.Column>
            </Grid.Row>
            <Grid.Row className='title'>
               <Grid.Column
                  as='h2'
                  textAlign='center'
                  computer={16}
                  tablet={16}
                  mobile={16}
               >
                  <span className='font-bold'>{appTitle} </span> is requesting
                  to use your NEAR account.
               </Grid.Column>
            </Grid.Row>
            <Grid.Row className='contract'>
               <Grid.Column
                  textAlign='center'
                  computer={16}
                  tablet={16}
                  mobile={16}
               >
                  Contract: {contractId}
               </Grid.Column>
            </Grid.Row>
            <Grid.Row>
               <Grid.Column
                  largeScreen={2}
                  computer={1}
                  mobile={16}
                  only='large screen computer mobile'
               />
               <Grid.Column
                  largeScreen={6}
                  computer={7}
                  tablet={8}
                  mobile={8}
                  className='cont'
               >
                  {contractId &&
                  <List className='border-right-light'>
                     <List.Item as='h3'>This allows:</List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           View your Account Name
                        </List.Content>
                     </List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           Write Chat messages with your name
                        </List.Content>
                     </List.Item>
                  </List>}
                  {!contractId &&
                  <List className='border-right-light'>
                     <List.Item as='h3'>This allows:</List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           Create new accounts
                        </List.Content>
                     </List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           Transfer tokens from your account to other accounts
                        </List.Content>
                     </List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           Deploy smart contracts
                        </List.Content>
                     </List.Item>
                  </List>}
               </Grid.Column>
               <Grid.Column
                  largeScreen={6}
                  computer={7}
                  tablet={8}
                  mobile={8}
                  className='cont'
               >
                  {contractId &&
                  <List>
                     <List.Item as='h3'>Does not allow:</List.Item>
                     <List.Item className='list-item-deny'>
                        <List.Content className='color-black'>
                           View your private account details
                        </List.Content>
                     </List.Item>
                     <List.Item className='list-item-deny'>
                        <List.Content className='color-black'>
                           Buy, Sell, or Transfer on your behalf
                        </List.Content>
                     </List.Item>
                  </List>}
                  {!contractId &&
                  <List>
                     <List.Item as='h3'>Does not allow:</List.Item>
                  </List>}
               </Grid.Column>
               <Grid.Column
                  largeScreen={2}
                  computer={1}
                  mobile={16}
                  only='large screen computer mobile'
               />
            </Grid.Row>
         </Grid>

         {children}
      </Dimmer.Dimmable>
   </CustomContainer>
)

LoginContainer.propTypes = {
   loader: PropTypes.bool,
   children: PropTypes.element,
   appTitle: PropTypes.string
}

export default LoginContainer
