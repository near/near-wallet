import React from 'react'
import { Link } from 'react-router-dom'

import MainImage from '../common/MainImage'

import { List, Button } from 'semantic-ui-react'

import AccountGreyImage from '../../images/icon-account-grey.svg'

const ContactsRemove = () => (
   <List>
      <List.Item>
         <List horizontal className='title'>
            {false &&
               <List.Item>
                  <MainImage 
                     src={AccountGreyImage} 
                     size='medium'
                  />
               </List.Item>
            }
            <List.Item>
               <List.Header as='h2'>
                  Alex Skidanov
               </List.Header>
               <List.Item as='h5'>@alex.near</List.Item>
            </List.Item>
         </List>
      </List.Item>
      <List.Item className='remove-connection'>
         <Button>REMOVE CONNECTION</Button>
      </List.Item>
      <List.Item className='recent-transactions'>
         <List.Item
            as='h6'
            className='recent-transactions-title border-top'
         >
            RECENT TRANSACTIONS
         </List.Item>
         <List.Item className='recent-transactions-row border-top'>
            <List.Header>You sent 20 Ⓝ</List.Header>
            <List.Item>3h ago</List.Item>
         </List.Item>
         <List.Item className='recent-transactions-row border-top'>
            <List.Header>Alex sent you 1020 Ⓝ</List.Header>
            <List.Item>3d ago</List.Item>
         </List.Item>
         <List.Item className='recent-transactions-row border-top'>
            <List.Header>
               You and Alex played NEAR Chess
            </List.Header>
            <List.Item>1w ago</List.Item>
         </List.Item>
      </List.Item>
      <List.Item className='send-money border-top'>
         <Button as={Link} to='/send-money/marcin'>
            SEND MONEY
         </Button>
      </List.Item>
   </List>
)

export default ContactsRemove
