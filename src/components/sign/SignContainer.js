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
      button {
         width: 190px;
         margin-top: 0px;
         padding: 0 0;
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
      .cont {
         padding: 0 0 16px 0;
      }
      .more-information {
         position: relative;
         width: 200px;
         height: 40px;
         margin: 0 auto;
         cursor: pointer;

         font-size: 13px;
         line-height: 40px;
         border-radius: 20px;
         
         background: #f8f8f8;

         :hover {
            color: #24272a;
         }
         .circle {
            position: absolute;
            width: 30px;
            height: 30px;
            background: #fca347;
            color: #fff;
            top: 5px;
            right: 5px;

            border-radius: 100%;
            line-height: 30px;
         }
      }
      .top-back {
         display: flex;
         padding-bottom: 12px;

         .back-button {
            display: flex;
            cursor: pointer;

            svg {
               margin: 0 12px 0 18px;
               width: 12px;

               polyline {
                  stroke: #0072ce;
               }
            }
         }
      }
      .details {
         background: #f8f8f8;
         padding: 0 18px;

         .details-item {
            padding: 12px 0px;
            border-bottom: 1px solid #e6e6e6;

            .title {
               padding: 6px 0 0 0;
            }
            .details-subitem {
               padding: 12px 12px 0;

               .desc {
                  display: flex;
                  padding-top: 4px;
                  line-height: 16px;

                  .icon {
                     margin-right: 10px;
                     margin-top: 2px;

                     svg {
                        width: 26px;

                        &.gray {
                           polygon {
                              stroke: #999;
                           }
                           .cls-2 {
                              fill: #999;
                           }
                        }
                        &.orange {
                           polygon {
                              stroke: #fca347;
                           }
                           .cls-2 {
                              fill: #fca347;
                           }
                        }
                     }
                  }
               }
            }
         }
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
            margin-top: 0px;
            margin-bottom: -18px;
         }
         .but-sec {
            padding-top: 0px;
         }
         .contract {
            .column {
               background: #f8f8f8;
            }
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
         #bottom {
            border-top: 2px solid #f2f2f2;
         }
         .details {
            min-height: calc(100vh - 126px);
         }
         .tx {
            padding: 0px;

            > .column {
               padding: 0px;
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
