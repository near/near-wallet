import React from 'react'

import { Image, Loader } from 'semantic-ui-react'

import AccountGreyImage from '../../images/icon-account-grey.svg'
import MobileMenuImage from '../../images/icon-mobile-menu.svg'
import CloseImage from '../../images/icon-close.svg'
import ArrowDownImage from '../../images/icon-arrow-down.svg'

import styled from 'styled-components'

const CustomDiv = styled('div')`
   overflow: hidden;
   width: 100%;
   cursor: pointer;
   font-family: 'benton-sans', sans-serif;
   font-weight: 600;
   > div {
      .account-img {
         width: 36px;
         height: 36px;
         background: #4a4f54;
         padding-right: 0px;
         padding-left: 6px;
         border-radius: 18px;
         margin-top: 16px;
         margin-right: 10px;
         > img {
            width: 24px;
            height: 24px;
            margin-top: 5px;
         }
      }
      .overflow {
         overflow: hidden;
      }
      .account-arrow {
         float: right;
         padding-right: 14px;
         padding-left: 14px;
         padding-top: 24px;
         img {
            width: 20px;
         }
         &.desktop {
            padding-top: 32px;
            padding-right: 26px;
            img {
               width: 12px;
            }
         }
      }
      .account-tokens {
         float: right;
         line-height: 29px;
         font-size: 14px;
         color: #fff;
         margin: 21px 0 0 10px;
         height: 28px;
         background: #111314;
         border-radius: 14px;
         padding: 0 10px;
         letter-spacing: normal;
         max-width: 140px;
         :hover {
            color: #fff;
         }
         > div {
            display: flex;
            > div {
               text-overflow: ellipsis;
               overflow: hidden;

               &.near {
                  text-overflow: initial;
               }
            }
         }
         .near {
            font-size: 18px;
            padding-left: 4px;
            font-weight: 500;
         }
      }
      .account-name {
         overflow: hidden;
         padding-right: 0px;
         text-align: right;
         padding-left: 0px;
         line-height: 72px;
         > div {
            font-size: 14px;
            letter-spacing: normal;
            padding-left: 0px;
            padding-right: 0px;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #fff;
            :hover {
               color: #fff;
            }
         }
      }
   }
`

const PopupMenuTrigger = ({ account, handleClick, type, dropdown = false }) => (
   <CustomDiv onClick={handleClick}>
      <div>
         {type === 'desktop' && (
            <div className='account-img' style={{ float: 'left' }}>
               <Image src={AccountGreyImage} />
            </div>
         )}
         <div className={`account-arrow ${type}`}>
            {type === 'mobile' && (
               <Image src={dropdown ? MobileMenuImage : CloseImage} />
            )}
            {type === 'desktop' && <Image src={ArrowDownImage} />}
         </div>
         <div className='overflow'>
            <div className='account-tokens'>
               {account.loader || !account.accountId ? (
                  <Loader active inline size='mini' />
               ) : (
                  <div>
                     <div>{account.amountStr} </div>
                     <div className='near'>Ⓝ</div>
                  </div>
               )}
            </div>
            <div className='account-name'>
               {account.loader || !account.accountId ? (
                  <Loader active inline size='mini' />
               ) : (
                  <div>@{account.accountId}</div>
               )}
            </div>
         </div>
      </div>
   </CustomDiv>
)

export default PopupMenuTrigger
