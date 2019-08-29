import React from 'react'
import PropTypes from 'prop-types'

import {
   Container
} from 'semantic-ui-react'

import CheckBlueImage from '../../images/icon-check-blue.svg'
import DenyImage from '../../images/icon-deny.svg'

import styled from 'styled-components'

const CustomContainer = styled(Container)`
   &&& {
      .authorize {
         margin-top: 30px;
         height: 48px;

         svg {
            width: 48px;
            height: 48px;

            #icon-transactions {
               stroke: #999;
            }
         }
      }
      .title {
         padding-top: 30px;
      }
      .cont {
         padding: 32px 0 32px 32px;
         background: #f8f8f8;

         img {
            height: 24px;
            margin-right: 6px;
         }
         div.item {
            padding-top: 24px;

            .content {
               line-height: 28px;
            }
         }
      }
      .list-item {
         background: url(${CheckBlueImage}) no-repeat left 24px;
         background-size: 24px 24px;
         padding-right: 12px;

         > .content {
            padding-left: 32px;
         }
      }
      .list-item-deny {
         background: url(${DenyImage}) no-repeat left 24px;
         background-size: 24px 24px;
         padding-right: 12px;

         > .content {
            padding-left: 32px;
         }
      }
      .contract {
         font-size: 12px;
         padding: 0px;

         .column {
            padding: 12px 0;
         }
      }
      button {
         width: 190px;
         margin-top: 0px;
         padding: 0 12px;
         float: right;

         :first-of-type {
            float: left;
         }
      }
      @media screen and (max-width: 991px) {
         .authorize {
            margin-top: 0px;
            margin-bottom: -18px;
         }
         .but-sec {
            padding-top: 0px;
         }
         .cont {
            padding: 16px 0 16px 32px;

            h3 {
               font-size: 14px !important;
            }
            div.item {
               .content {
                  font-size: 12px;
                  line-height: 16px;
                  padding-top: 4px;
                  min-height: 24px;
               }
            }
         }
         .contract {
            .column {
               background: #f8f8f8;
            }
         }
      }
      @media screen and (max-width: 767px) {
         margin: 0px !important;

         .cont {
            padding: 16px 0 16px 16px;
         }
         button {
            width: 140px;
            margin-top: 0px;
            float: right;

            :first-of-type {
               float: left;
            }
         }
      }
   }
`

const LoginContainer = ({ children }) => (
   <CustomContainer>
      {children}
   </CustomContainer>
)

LoginContainer.propTypes = {
   loader: PropTypes.bool,
   children: PropTypes.element,
   appTitle: PropTypes.string
}

export default LoginContainer
