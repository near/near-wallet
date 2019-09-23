import React from 'react'
import { List } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomList = styled(List)`
   &&& {
      margin: 26px 0 0 1rem;
      padding-left: 30px;
      border-left: 4px solid #f8f8f8;

      .title {
         letter-spacing: 2px;
         font-weight: 600;
         line-height: 20px;
         color: #4a4f54;
      }

      @media screen and (max-width: 991px) {
         margin: 26px 0 0 -1rem;
         padding-left: 30px;
         border-left: 4px solid #f8f8f8;

         .title {
            letter-spacing: 2px;
            font-weight: 600;
            line-height: 20px;
            color: #4a4f54;
         }
      }

      @media screen and (max-width: 767px) {
         font-size: 12px;
         padding-left: 1rem;
      }
   }
`

const AccountNote = () => (
   <CustomList>
      <List.Item className='title'>NOTE</List.Item>
      <List.Item>
         Your username can contain any of the following:
      </List.Item>
      <List.Item>• Lowercase characters (a-z)</List.Item>
      <List.Item>• Digits (0-9)</List.Item>
      <List.Item>• Characters (_-) can be used as separators</List.Item>
   </CustomList>
)

export default AccountNote
