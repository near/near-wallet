import React from 'react'

import { Image, Loader } from 'semantic-ui-react'

import MainImage from '../common/MainImage'
import Balance from '../common/Balance'

import AccountGreyImage from '../../images/icon-account-grey.svg'
import MobileMenuImage from '../../images/icon-mobile-menu.svg'
import CloseImage from '../../images/icon-close.svg'
import ArrowDownImage from '../../images/icon-arrow-down.svg'
import milli from '../../images/n-1000-wht.svg'

import styled from 'styled-components'

const CustomDiv = styled('div')`
   overflow: hidden;
   width: 100%;
   cursor: pointer;
   font-family: 'benton-sans', sans-serif;
   font-weight: 600;
   > div {
      .account-img {
         padding-left: 6px;
         float: left;
         
         margin-top: 18px;
         margin-right: 10px;

         > div {
            background: #4a4f54 !important;
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
         max-width: 170px;
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
            <div className='account-img'>
               <MainImage
                  src={AccountGreyImage}
                  size='small'
               />
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
                        {(account.amount && milli) ? <Balance
                           amount={account.amount}
                           milli={milli} /> : "NaN"}
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
