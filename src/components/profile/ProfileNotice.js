import React from 'react'

import { List } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomList = styled(List)`
   &&& {
      padding: 8px 0 8px 20px;
      margin-left: 28px;
      margin-top: 20px;

      .header {
         line-height: 28px;
      }
      .content {
         line-height: 20px;
      }

      @media screen and (max-width: 767px) {
         margin-left: 0px;
      }
   }
`

const ProfileNotice = () => (
   <CustomList className='border-left-bold'>
      <List.Item className=''>
         <List.Header>Never give your keys away</List.Header>
         <List.Content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            sit amet pretium mi, a molestie est.
            <a href='/'>Learn more</a>
         </List.Content>
      </List.Item>
   </CustomList>
)

export default ProfileNotice
