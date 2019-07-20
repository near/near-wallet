import React from 'react'

import { Link } from 'react-router-dom'

import { Popup, Grid, Image } from 'semantic-ui-react'

import MainImage from '../common/MainImage'

import AccountGreyImage from '../../images/icon-account-grey.svg'
import LockImage from '../../images/icon-lock.svg'

import styled from 'styled-components'

const CustomGrid = styled(Grid)`
   &&& {
      .row {
         padding-top: 12px;
         padding-bottom: 12px;

         .edit-link {
            font-weight: 600;
         }
         .title {
            font-weight: 600;
            color: #24272a;
         }
      }

      .locked {
         float: right;
         border: 0px;
         padding: 1px 7px;
         width: 32px;
         height: 32px;
         background: #f8f8f8;
         border-radius: 32px;

         img {
            padding-top: 4px;
         }
      }

      .row-title {
         margin-top: 20px;
      }

      @media screen and (max-width: 991px) {
      }
      @media screen and (max-width: 767px) {
         margin-left: 0px;
         margin-right: 0px;

         .column {
            padding-left: 0px;
            padding-right: 0px;
         }
      }
   }
`

const ProfileDetails = ({ account }) => (
   <CustomGrid>
      <Grid.Row>
         <Grid.Column
            computer='10'
            tablet='10'
            mobile='16'
            as='h6'
            className='color-charcoal-grey'
         >
            PROFILE
         </Grid.Column>
         <Grid.Column computer='4' as='h6' textAlign='center' only='tablet'>
            VISIBLE TO
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='3' tablet='3' mobile='4' className='title'>
            Username
         </Grid.Column>
         <Grid.Column computer='7' tablet='7' mobile='9'>
            @{account.accountId}
         </Grid.Column>
         <Grid.Column computer='4' tablet='4' textAlign='center' only='tablet'>
            Public
         </Grid.Column>
         <Grid.Column computer='2' tablet='2' mobile='3' textAlign='right'>
            <Popup
               trigger={
                  <div className='locked'>
                     <Image src={LockImage} align='left' />
                  </div>
               }
               hoverable
               position='left center'
            >
               <Popup.Header>Why is this locked?</Popup.Header>
               <Popup.Content>
                  Your username is your unique identifier in the system and cannot be changed
                  because data and asset ownership is tied to it.
                  However you are welcome to <Link to="/create">create another account</Link> with desired name
                  and transfer assets as needed.
                  {` `}
                  {false ?
                  <a href='/'>Learn more</a>
                  : null }
               </Popup.Content>
            </Popup>
         </Grid.Column>
      </Grid.Row>
      {false ? <div>
      <Grid.Row className='border-top'>
         <Grid.Column computer='3' tablet='3' mobile='4' className='title'>
            Full Name
         </Grid.Column>
         <Grid.Column computer='7' tablet='7' mobile='9'>
            Evgeny Kuzyakov
         </Grid.Column>
         <Grid.Column computer='4' tablet='4' textAlign='center' only='tablet'>
            Friends
         </Grid.Column>
         <Grid.Column
            as={Link}
            to='/'
            computer='2'
            tablet='2'
            mobile='3'
            textAlign='right'
            className='edit-link'
         >
            Edit
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='3' tablet='3' mobile='4' className='title'>
            Photo
         </Grid.Column>
         <Grid.Column computer='7' tablet='7' mobile='9'>
            <MainImage 
               src={AccountGreyImage} 
               size='huge'
            />
         </Grid.Column>
         <Grid.Column computer='4' tablet='4' textAlign='center' only='tablet'>
            Public
         </Grid.Column>
         <Grid.Column
            as={Link}
            to='/'
            computer='2'
            tablet='2'
            mobile='3'
            textAlign='right'
            className='edit-link'
         >
            Edit
         </Grid.Column>
      </Grid.Row>

      <Grid.Row className='border-top-bold row-title'>
         <Grid.Column
            computer='10'
            tablet='10'
            mobile='16'
            as='h6'
            className='color-charcoal-grey'
         >
            CONTACT INFORMATION
         </Grid.Column>
         <Grid.Column
            computer='4'
            tablet='4'
            as='h6'
            textAlign='center'
            only='tablet'
         >
            VISIBLE TO
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='3' tablet='3' mobile='4' className='title'>
            Email
         </Grid.Column>
         <Grid.Column computer='7' tablet='7' mobile='9'>
            email@website.com
         </Grid.Column>
         <Grid.Column computer='4' tablet='4' textAlign='center' only='tablet'>
            Public
         </Grid.Column>
         <Grid.Column
            as={Link}
            to='/'
            computer='2'
            tablet='2'
            mobile='3'
            textAlign='right'
            className='edit-link'
         >
            Edit
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='3' tablet='3' mobile='4' className='title'>
            Phone
         </Grid.Column>
         <Grid.Column computer='7' tablet='7' mobile='9'>
            000-000-0000
         </Grid.Column>
         <Grid.Column computer='4' tablet='4' textAlign='center' only='tablet'>
            Friends
         </Grid.Column>
         <Grid.Column
            as={Link}
            to='/'
            computer='2'
            tablet='2'
            mobile='3'
            textAlign='right'
            className='edit-link'
         >
            Edit
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='3' tablet='3' mobile='4' className='title'>
            Address
         </Grid.Column>
         <Grid.Column computer='7' tablet='7' mobile='9'>
            1234 N. West Ave., San Francisco, CA 98562
         </Grid.Column>
         <Grid.Column computer='4' tablet='4' textAlign='center' only='tablet'>
            Friends
         </Grid.Column>
         <Grid.Column
            as={Link}
            to='/'
            computer='2'
            tablet='2'
            mobile='3'
            textAlign='right'
            className='edit-link'
         >
            Edit
         </Grid.Column>
      </Grid.Row>

      <Grid.Row className='border-top-bold row-title'>
         <Grid.Column
            computer='10'
            tablet='10'
            mobile='16'
            as='h6'
            className='color-charcoal-grey'
         >
            FINANCIAL INFORMATION
         </Grid.Column>
         <Grid.Column
            computer='4'
            tablet='4'
            as='h6'
            textAlign='center'
            only='tablet'
         >
            VISIBLE TO
         </Grid.Column>
      </Grid.Row>
      </div> : null }

      <Grid.Row className='border-top'>
         <Grid.Column computer='3' tablet='3' mobile='4' className='title'>
            Balance
         </Grid.Column>
         <Grid.Column computer='7' tablet='7' mobile='9'>
            {account.amount} Ⓝ
         </Grid.Column>
         <Grid.Column computer='4' tablet='4' textAlign='center' only='tablet'>
            Public
         </Grid.Column>
         <Grid.Column as="div">
         </Grid.Column>
      </Grid.Row>
   </CustomGrid>
)

export default ProfileDetails
