import React from 'react'

import AuthorizedAppsDeauthorize from '../authorized-apps/AuthorizedAppsDeauthorize'
import ContactsRemove from '../contacts/ContactsRemove'

import { List, Image } from 'semantic-ui-react'

import CloseImage from '../../images/icon-close.svg'
import MTransactionImage from '../../images/icon-m-transaction.svg'
import CheckBlueImage from '../../images/icon-check-blue.svg'

import styled from 'styled-components'

const CustomList = styled(List)`
   &&& {
      background: #fff;
      width: 100%;
      height: 100%;
      padding: 0 0;

      > .item {
         padding: 18px 20px;
      }
      .img {
         width: 20px;
         position: absolute;
         top: 20px;
         right: 20px;
         padding: 0px;

         img {
            cursor: pointer;
         }
      }
      .text {
         margin: 0 10% 0 0;
         color: #24272a;
         float: left;

         .header {
            font-family: 'benton-sans', sans-serif;
         }
         .content {
            color: #999999;
            padding-top: 12px;
            line-height: 20px;
         }
      }
      .main-image {
         border: 0px;
         padding: 0 10px;
         width: 48px;
         height: 48px;
         background: #e6e6e6;
         border-radius: 32px;
         margin: 0 0 0 0;

         img {
            padding-top: 10px;
         }
      }
      .remove-connection {
         > button {
            width: 100%;
            background-color: #ff585d;
            border: 2px solid #ff585d;
            border-radius: 25px;
            color: #fff;
            font-weight: 600;

            :hover {
               background: #fff;
               color: #ff585d;
            }
         }
      }
      .recent-transactions {
         background-color: #f8f8f8;
         margin: 0 0 0 0;
      }
      .recent-transactions-title {
         padding: 0 0 0 24px;
         background: url(${MTransactionImage}) no-repeat left 2px;
         background-size: 12px auto;
      }
      .recent-transactions-row {
         margin: 0 0 0 24px;
         padding: 12px 0;
         border-bottom: 2px solid #e6e6e6;
      }
      .recent-transactions-row:last-child {
         border-bottom: 0px solid #e6e6e6;
      }
      .authorized-transactions {
         background-color: #fff;
         margin: 0 0 0 0;
         padding-top: 0px;
      }
      .authorized-transactions-title {
         padding: 12px 0 0 24px;
         background: url(${MTransactionImage}) no-repeat left 14px;
         background-size: 12px auto;
      }
      .authorized-transactions-row {
         margin: 0 0 0 24px;
         padding: 12px 0 0 32px;
         background: url(${CheckBlueImage}) no-repeat left 14px;
         line-height: 32px;
      }
      .authorized-transactions-row:last-child {
         border-bottom: 0px solid #e6e6e6;
      }
      .send-money {
         > .button {
            width: 100%;
            background-color: #5ace84;
            border: 2px solid #5ace84;
            border-radius: 25px;
            color: #fff;
            font-weight: 600;

            :hover {
               background-color: #fff;
               color: #5ace84;
            }
         }
      }
      @media screen and (max-width: 991px) {
         .img {
            top: 6px;
            right: 6px;
         }
         .main-image {
            display: none;
         }
      }
      @media screen and (max-width: 767px) {
         border: 0px;
         position: absolute;
         min-height: 300px;
         top: -80px;

         .img {
            top: 0;
            right: 2px;
         }
         > .item {
            padding: 0px;

            h2 {
               font-size: 40px !important;
            }
            > .list {
               padding: 0;
            }
            .title {
               width: 100%;
               padding-bottom: 12px;
               
               > .item {
                  width: 100%;
                  text-align: center;
                  margin-left: 0;
               }
               .image {
                  .main-image {
                     margin: 0 auto;
                     width: 72px;
                     height: 72px;

                     > img {
                        width: 72px;
                        height: 72px;
                     }
                  }
               }
            }
         }
         .remove-connection {
            padding-top: 12px;
            border-top: 4px solid #e6e6e6;
         }
      }
   }
`

const PaginationShowSubBox = ({ toggleCloseSub, subPage, showSubData, handleDeauthorize }) => (
   <CustomList className='box'>
      <List.Item className='img'>
         <Image
            onClick={() => toggleCloseSub()}
            src={CloseImage}
         />
      </List.Item>
      <List.Item>
         {subPage === 'authorized-apps' && showSubData ? (
            <AuthorizedAppsDeauthorize 
               showSubData={showSubData}
               handleDeauthorize={handleDeauthorize}
            />
         ) : (
            <ContactsRemove
               showSubData={showSubData}
               handleDeauthorize={handleDeauthorize}
            />
         )}
      </List.Item>
   </CustomList>
)

export default PaginationShowSubBox
