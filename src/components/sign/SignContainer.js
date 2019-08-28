import React from 'react'

import { Container } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomContainer = styled(Container)`
   &&& {
      .authorize {
         margin-top: 30px;
         height: 48px;

         .item {
            margin-left: 0px;
         }
         img {
            width: 48px;
            margin: 0 auto;
         }
      }
      .title {
         padding-top: 30px;
      }
      .estimated {
         .question-circle {
            font-size: 14px;
            display: inline-block;
            line-height: 0px;
            border-radius: 50%;
            background: #e6e6e6;

            :hover {
               background: #5ace84;
               color: #fff;
            }
            span {
               display: inline-block;
               padding-top: 50%;
               padding-bottom: 50%;
               margin-left: 8px;
               margin-right: 8px;
            }
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
      .close {
         button:first-of-type {
            float: none;
         }
      }
      .contract {
         font-size: 12px;
         background: #f8f8f8;
         text-align: center;
      }
      .estimated {
         background: #f8f8f8;
         padding: 24px 0;
         margin: 0 0 12px 0;
      }
      .gas {
         font-size: 12px;
         padding: 10px 0 0 0;
      }
      .fees {
         font-weight: 600;
      }
      .sub {
         color: #24272a;
         padding-top: 0;
      }
      .transferring-dots {
         :after {
            content: '.';
            animation: link 1s steps(5, end) infinite;
         
            @keyframes link {
               0%, 20% {
                  color: rgba(0,0,0,0);
                  text-shadow:
                     .3em 0 0 rgba(0,0,0,0),
                     .6em 0 0 rgba(0,0,0,0);
               }
               40% {
                  color: #24272a;
                  text-shadow:
                     .3em 0 0 rgba(0,0,0,0),
                     .6em 0 0 rgba(0,0,0,0);
               }
               60% {
                  text-shadow:
                     .3em 0 0 #24272a,
                     .6em 0 0 rgba(0,0,0,0);
               }
               80%, 100% {
                  text-shadow:
                     .3em 0 0 #24272a,
                     .6em 0 0 #24272a;
               }
            }
         }
      }

      @media screen and (max-width: 991px) {
         .authorize {
            margin-top: 18px;
            margin-bottom: -18px;
         }
         .but-sec {
            padding-top: 0px;
         }
      }

      @media screen and (max-width: 767px) {
         margin: 0px !important;

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

const SignContainer = ({ children }) => (
   <CustomContainer>
      {children}
   </CustomContainer>
)

export default SignContainer
