import React from 'react'

import { Link } from 'react-router-dom'

import {
   Loader,
   Popup,
   Grid,
   Dimmer,
   Button,
   Header,
   Image
} from 'semantic-ui-react'

import AccountGreyImage from '../../images/icon-account-grey.svg'

import styled from 'styled-components'

const CustomGrid = styled(Grid)`
   && {
      .row {
         padding-top: 12px;
         padding-bottom: 12px;
      }

      .main-image {
         border: 0px;
         padding: 0 10px;
         width: 48px;
         height: 48px;
         background: #e6e6e6;
         border-radius: 32px;

         img {
            padding-top: 10px;
         }
      }

      .locked {
         float: right;
         border: 0px;
         padding: 0 4px;
         width: 32px;
         height: 32px;
         background: #e6e6e6;
         border-radius: 32px;

         img {
            padding-top: 4px;
         }
      }
   }
`

const ProfileDetails = ({ loader }) => (
   <CustomGrid>
      <Grid.Row className='border-top-bold'>
         <Grid.Column computer='10' as='h6' className='color-charcoal-grey'>
            PROFILE
         </Grid.Column>
         <Grid.Column computer='4' as='h6' textAlign='center'>
            VISIBLE TO
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='3' className='color-black'>
            Username
         </Grid.Column>
         <Grid.Column computer='7'>@eugenethedream</Grid.Column>
         <Grid.Column computer='4' textAlign='center'>
            Public
         </Grid.Column>
         <Grid.Column computer='2' textAlign='right'>
            <Popup
               trigger={
                  <div className='locked'>
                     <Image src={AccountGreyImage} className='' align='left' />
                  </div>
               }
               hoverable
               position='left center'
            >
               <Popup.Header className='color-black'>
                  Why is this locked?
               </Popup.Header>
               <Popup.Content>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur sit amet pretium mi, a molestie est.
                  <a href=''>Learn more</a>
               </Popup.Content>
            </Popup>
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='3' className='color-black'>
            Full Name
         </Grid.Column>
         <Grid.Column computer='7'>Evgeny Kuzyakov</Grid.Column>
         <Grid.Column computer='4' textAlign='center'>
            Friends
         </Grid.Column>
         <Grid.Column as={Link} to='/' computer='2' textAlign='right'>
            Edit
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='3' className='color-black'>
            Photo
         </Grid.Column>
         <Grid.Column computer='7'>
            <div className='main-image'>
               <Image src={AccountGreyImage} className='' align='left' />
            </div>
         </Grid.Column>
         <Grid.Column computer='4' textAlign='center'>
            Public
         </Grid.Column>
         <Grid.Column as={Link} to='/' computer='2' textAlign='right'>
            Edit
         </Grid.Column>
      </Grid.Row>

      <Grid.Row className='border-top-bold'>
         <Grid.Column computer='10' as='h6' className='color-charcoal-grey'>
            CONTACT INFORMATION
         </Grid.Column>
         <Grid.Column computer='4' as='h6' textAlign='center'>
            VISIBLE TO
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='3' className='color-black'>
            Email
         </Grid.Column>
         <Grid.Column computer='7'>email@website.com</Grid.Column>
         <Grid.Column computer='4' textAlign='center'>
            Public
         </Grid.Column>
         <Grid.Column as={Link} to='/' computer='2' textAlign='right'>
            Edit
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='3' className='color-black'>
            Phone
         </Grid.Column>
         <Grid.Column computer='7'>000-000-0000</Grid.Column>
         <Grid.Column computer='4' textAlign='center'>
            Friends
         </Grid.Column>
         <Grid.Column as={Link} to='/' computer='2' textAlign='right'>
            Edit
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='3' className='color-black'>
            Address
         </Grid.Column>
         <Grid.Column computer='7'>
            1234 N. West Ave., San Francisco, CA 98562
         </Grid.Column>
         <Grid.Column computer='4' textAlign='center'>
            Friends
         </Grid.Column>
         <Grid.Column as={Link} to='/' computer='2' textAlign='right'>
            Edit
         </Grid.Column>
      </Grid.Row>

      <Grid.Row className='border-top-bold'>
         <Grid.Column computer='10' as='h6' className='color-charcoal-grey'>
            FINANCIAL INFORMATION
         </Grid.Column>
         <Grid.Column computer='4' as='h6' textAlign='center'>
            VISIBLE TO
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='3' className='color-black'>
            Balance
         </Grid.Column>
         <Grid.Column computer='7'>2,300 Ⓝ</Grid.Column>
         <Grid.Column computer='4' textAlign='center'>
            Only Me
         </Grid.Column>
         <Grid.Column as={Link} to='/' computer='2' textAlign='right'>
            Edit
         </Grid.Column>
      </Grid.Row>
   </CustomGrid>
)

export default ProfileDetails
