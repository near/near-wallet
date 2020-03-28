import React from 'react'

import AccessKeysDeauthorize from '../access-keys/AccessKeysDeauthorize'
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
      .remove-connection {
         button.red {
            width: 100%;
            margin-top: 12px;
            margin-bottom: 6px;
         }
         .input {
            width: 100%;
         }
         .confirm > button {
            width: 45%;
            margin-top: 8px;
            margin-bottom: 6px;

            :first-of-type {
               margin-right: 10%;
            }
         }
         .alert-info {
            height: 14px;
            font-size: 14px;
            font-weight: 600;
            margin: 8px 0 0 0;
            text-align: center;
            color: #ff585d;
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
      .title {
         width: 100%;
      }
      .publickey {
         width: 100%;
         margin-top: 12px;

         .item {
            text-overflow: ellipsis;
            overflow: hidden;
         }
      }
      @media screen and (max-width: 991px) {
         .img {
            top: 6px;
            right: 6px;
         }
         .title {
            .item {
               margin-left: 0;
               text-align: center;
            }
         }
         .image {
            width: 100%;

            > div {
               margin: 0 auto;
            }
         }
      }
      @media screen and (max-width: 767px) {
         border: 0px;
         position: absolute;
         min-height: 300px;
         top: -80px;

         .img {
            top: -12px;
            right: 8px;
         }
         > .item {
            padding: 0px;

            h2 {
               font-size: 32px !important;
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
                  > div {
                     margin: 0 auto;
                  }
               }
            }
         }
         .remove-connection {
            padding-top: 0px;
            border-top: 2px solid #e6e6e6;
         }
      }
   }
`

const PaginationShowSubBox = ({ 
   toggleCloseSub,
   subPage,
   showSubData,
   handleDeauthorize,
   handleConfirm,
   handleConfirmSubmit,
   handleChange,
   handleConfirmClear,
   accountId,
   confirm,
   confirmStatus,
   buttonLoader
}) => (
   <CustomList className='box'>
      <List.Item className='img'>
         <Image
            onClick={() => toggleCloseSub()}
            src={CloseImage}
         />
      </List.Item>
      <List.Item>
         {subPage === 'access-keys' && showSubData ? (
            <AccessKeysDeauthorize 
               showSubData={showSubData}
               handleDeauthorize={handleDeauthorize}
               handleConfirm={handleConfirm}
               handleConfirmSubmit={handleConfirmSubmit}
               handleChange={handleChange}
               accountId={accountId}
               confirm={confirm}
               confirmStatus={confirmStatus}
               handleConfirmClear={handleConfirmClear}
               buttonLoader={buttonLoader}
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
