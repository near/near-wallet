import React from 'react'

import { Segment, List } from 'semantic-ui-react'

import AddBlueImage from '../../images/icon-add-blue.svg'
import ArrowDownImage from '../../images/icon-arrow-down.svg'
import ArrowUpImage from '../../images/icon-arrow-up.svg'
import AccountGreyImage from '../../images/icon-account-grey.svg'

import styled from 'styled-components'

const CustomSegment = styled(Segment)`
   &&& {
      width: 100%;
      position: relative;
      cursor: pointer;
      padding: 0px;
      margin: 0px;

      .segment {
         width: 100%;
         padding: 0px;
         margin: 0px;
      }
      .element {
         width: 100%;
         min-height: 64px;
         border: solid 4px #24272a;
         margin: 0px;
         padding: 0px;
         background: #fff;

         :hover {
            background: #f8f8f8;
         }
         .img {
            float: left;
            width: 56px;
            height: 56px;
            background-color: #d8d8d8;
            background-image: url(${AccountGreyImage});
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 36px 36px;
         }
         .name {
            margin-top: 12px;
            margin-left: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
         }
         .arrow {
            float: right;
            width: 56px;
            height: 56px;
            background-image: url(${ArrowDownImage});
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 24px auto;

            &.up {
               background-image: url(${ArrowUpImage});
            }
         }
      }
      .trigger {
         display: flex;
      }
      .dropdown {
         .element {
            margin-top: -4px;
            display: flex;
         }
      }
      .create-account {
         width: 100%;
         min-height: 64px;
         border: solid 4px #24272a;
         margin: 0px;
         padding: 0px;
         cursor: pointer;
         background: #24272a;

         .img {
            float: left;
            width: 56px;
            height: 56px;
            background-image: url(${AddBlueImage});
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 24px 24px;
         }
         .name {
            float: left;
            margin-top: 12px;
            margin-left: 18px;
         }
         .arrow {
         }
      }
   }
`

const SelectAccountDropdown = ({ handleOnClick, account, dropdown, handleSelectAccount, redirectCreateAccount }) => (
   <CustomSegment onClick={handleOnClick} basic>
      <List verticalAlign='middle' className={`element trigger`}>
         <List.Item className='img' />
         <List.Item as='h3' className='name'>
            @{account.accountId || ''}
         </List.Item>
         <List.Item className={`arrow ${dropdown ? 'up' : ''}`} />
      </List>

      <Segment basic className={`dropdown ${dropdown ? '' : 'hide'}`}>
         {account.accounts && Object.keys(account.accounts)
            .filter(a => a !== account.accountId)
            .map((account, i) => (
               <List
                  key={`lf-${i}`}
                  onClick={() => handleSelectAccount(account)}
                  className='element'
               >
                  <List.Item className='img' />
                  <List.Item as='h3' className='name'>
                     @{account}
                  </List.Item>
               </List>
            ))}
         <List
            onClick={redirectCreateAccount}
            className='create-account'
         >
            <List.Item className='img' />
            <List.Item className='h3 name color-seafoam-blue'>
               Create New Account
            </List.Item>
         </List>
      </Segment>
   </CustomSegment>
)

export default SelectAccountDropdown
