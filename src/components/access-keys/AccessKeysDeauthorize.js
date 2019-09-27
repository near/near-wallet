import React from 'react'

import MainImage from '../common/MainImage'

import { List, Button } from 'semantic-ui-react'
import Balance from '../common/Balance'

const AccessKeysDeauthorize = ({ showSubData, handleDeauthorize }) => (
   // TODO: Simplify layout as seems too much unnecessary nesting, while can use simple html tags, etc
   <List>
      <List.Item>
         <List horizontal className='title'>
            {false &&
               <List.Item className='image'>
                  <MainImage
                     src={showSubData.image}
                     size='big'
                  />
               </List.Item>
            }
            <List.Item>
               {showSubData.access_key.permission.FunctionCall
                  ? <React.Fragment>
                     <List.Header as='h2'>
                        {showSubData.access_key.permission.FunctionCall.receiver_id}
                     </List.Header>
                     <List.Item as='h5' className='color-blue'>
                        <span className='color-black'>
                           amount:{" "}
                        </span>
                        <Balance amount={showSubData.access_key.permission.FunctionCall.allowance} />
                     </List.Item>
                  </React.Fragment>
                  : null
               }
               <List.Item as='h5' className='color-blue' style={{
                  // TODO: Better way to fit public key
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  width: '30em'
               }}>
                  {showSubData.public_key}
               </List.Item>
            </List.Item>
         </List>
      </List.Item>
      <List.Item className='remove-connection'>
         <Button onClick={handleDeauthorize}>
            DEAUTHORIZE
         </Button>
      </List.Item>
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
         {showSubData.access_key.permission === 'FullAccess'
            ? <List.Item className='authorized-transactions-row color-black'>
               Submit any transaction on your behalf
            </List.Item>
            : null
         }
         {showSubData.access_key.permission.FunctionCall
            ? <List.Item className='authorized-transactions-row color-black'>
               Use <b>{showSubData.access_key.permission.FunctionCall.receiver_id}</b> contract on your behalf
            </List.Item>
            : null
         }
      </List.Item>
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

export default AccessKeysDeauthorize
