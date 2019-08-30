import React from 'react'

import MainImage from '../common/MainImage'

import { List, Button } from 'semantic-ui-react'

const AuthorizedAppsDeauthorize = ({ showSubData, handleDeauthorize }) => (
   <List>
      <List.Item>
         <List horizontal className='title'>
            {false && 
               <List.Item className='image'>
                  <MainImage 
                     src={showSubData[0]} 
                     size='big'
                  />
               </List.Item>
            }
            <List.Item>
               <List.Header as='h2'>
                  {showSubData[1]}
               </List.Header>
               <List.Item as='h5' className='color-blue'>
                  <span className='color-black'>
                     amount:
                  </span>
                  {showSubData[2]}Ⓝ
               </List.Item>
            </List.Item>
         </List>
      </List.Item>
      <List.Item className='remove-connection'>
         <Button onClick={handleDeauthorize}>
            DEAUTHORIZE
         </Button>
      </List.Item>
      {false && (
         <List.Item className='authorized-transactions'>
            <List.Item
               as='h6'
               className='authorized-transactions-title border-top'
            >
               AUTHORIZED TO
            </List.Item>
            <List.Item className='authorized-transactions-row color-black'>
               View your Account Name
            </List.Item>
            <List.Item className='authorized-transactions-row color-black'>
               Do something else on your behalf
            </List.Item>
         </List.Item>
      )}
      {false && (
         <List.Item className='recent-transactions'>
            <List.Item
               as='h6'
               className='recent-transactions-title border-top'
            >
               RECENT TRANSACTIONS
            </List.Item>
            <List.Item className='recent-transactions-row border-top'>
               <List.Header>
                  Another thing here
               </List.Header>
               <List.Item>3h ago</List.Item>
            </List.Item>
            <List.Item className='recent-transactions-row border-top'>
               <List.Header>
                  Another Thing Happened
               </List.Header>
               <List.Item>3d ago</List.Item>
            </List.Item>
            <List.Item className='recent-transactions-row border-top'>
               <List.Header>
                  In-app purchase: 20 Ⓝ
               </List.Header>
               <List.Item>1w ago</List.Item>
            </List.Item>
            <List.Item className='recent-transactions-row border-top'>
               <List.Header>Staked: 10 Ⓝ</List.Header>
               <List.Item>2w ago</List.Item>
            </List.Item>
            <List.Item className='recent-transactions-row border-top'>
               <List.Header>Authorized</List.Header>
               <List.Item>2w ago</List.Item>
            </List.Item>
         </List.Item>
      )}
   </List>
)

export default AuthorizedAppsDeauthorize
