import React from 'react'

import { List, Button, Image } from 'semantic-ui-react'

import TKeySwapImage from '../../images/icon-t-key-swap.svg'
import TContractImage from '../../images/icon-t-contract.svg'

import styled from 'styled-components'

const CustomList = styled(List)`
   &&& {
      background: #fff;
      width: 100%;
      margin-top: -1rem;
      padding: 14px 4px 14px 14px;

      .keys {
         img {
            width: 24px;
            margin-top: 2px;
         }
      }
      .account {
         margin-top: 12px;

         &-name {
            margin-top: 12px;
            text-overflow: ellipsis;
            overflow: hidden;
         }
         img {
            width: 18px;
            margin-top: 8px;
            margin-right: 20px;
         }
         .download {
            margin: 0px;
         }
         button {
            width: 130px;
            background-color: #0072ce;
            border: 2px solid #0072ce;
            border-radius: 25px;
            color: #fff;
            font-weight: 600;
            margin-left: 20px;

            :hover {
               background-color: #fff;
               color: #0072ce;
            }
         }
         .account-name {
            color: #24272a;
            font-weight: 600;
         }
      }

      @media screen and (max-width: 991px) {
         &&& {
            .account {
               .download {
                  float: none;
                  margin: 0 0 0 16px;
               }
            }
         }
      }
      @media screen and (max-width: 767px) {
         &&& {
            margin-top: 20px;

            .account {
               button {
                  margin-left: 8px;
               }
               .download {
                  float: right;
                  margin: 0 0 0 0;
               }
            }
         }
      }
   }
`

const ProfileYourKeys = () => (
   <CustomList className='box'>
      <List.Item className='keys'>
         <List.Icon as={Image} src={TKeySwapImage} />
         <List.Content as='h2'>Your Keys</List.Content>
      </List.Item>
      <List.Item className='account'>
         <List.Content floated='right' className='download'>
            <Button>DOWNLOAD</Button>
         </List.Content>
         <List.Content>
            <Image align='left' src={TContractImage} />
         </List.Content>
         <List.Content className='account-name'>
            @eugenethedream.key
         </List.Content>
      </List.Item>
   </CustomList>
)

export default ProfileYourKeys
