import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import ArrowGrnImage from '../../images/icon-arrow-grn.svg'
import ArrowRightImage from '../../images/icon-arrow-right.svg'

import styled from 'styled-components'

const CustomButton = styled(Button)`
   &&& {
      color: #fff;
      font-weight: 500;
      letter-spacing: 2px;

      margin: 24px 0 0 0;
      border: 2px solid;

      width: 288px;
      height: 60px;
      border-radius: 30px;
      
      font-size: 18px;

      &.small {
         width: 110px;
         height: 40px;
         border-radius: 20px;
         letter-spacing: 0;
         padding: 0px 0px;
         font-weight: 600;
         
         font-size: 14px;
      }

      &.blue {
         border-color: #0072ce;
         background: #0072ce;

         :disabled {
            background: #e6e6e6;
            border-color: #e6e6e6;
            opacity: 1 !important;
         }
         :active,
         :hover,
         :focus {
            border-color: #4096db;
            background: #4096db;
         }
      }
      &.green {
         border-color: #5ace84;
         background: #5ace84;

         :disabled {
            border-color: #e6e6e6;
            background: #e6e6e6;
            opacity: 1 !important;
         }
         :active,
         :hover,
         :focus {
            border-color: #61de8d;
            background: #61de8d;
         }
      }
      &.green-white-arrow {
         color: #5ace84;
         border-color: #5ace84;
         background-color: #fff;
         background-image: url(${ArrowGrnImage});
         background-repeat: no-repeat;
         background-position: 90% center;
         background-size: 14px 20px;
         padding-right: 70px;

         :disabled {
            color: e6e6e6;
            border-color: #e6e6e6;
            background: #fff;
            opacity: 1 !important;
         }
         :active,
         :hover,
         :focus {
            color: #fff;
            border-color: #61de8d;
            background-color: #61de8d;
            background-image: url(${ArrowRightImage});
         }
      }
      &.gray-white {
         color: #cccccc;
         border-color: #cccccc;
         background: #fff;

         :disabled {
            border-color: #e6e6e6;
            background: #e6e6e6;
            opacity: 1 !important;
         }
         :active,
         :hover,
         :focus {
            color: #fff;
            border-color: #cccccc;
            background: #cccccc;
         }
      }
      &.gray-blue {
         color: #0072ce;
         border-color: #f8f8f8;
         background: #f8f8f8;

         :disabled {
            border-color: #e6e6e6;
            background: #e6e6e6;
            opacity: 1 !important;
         }
         :active,
         :hover,
         :focus {
            color: #0072ce;
            border-color: #f8f8f8;
            background: #fff;
         }
      }
      &.link {
         width: auto;
         height: auto;
         letter-spacing: 0;
         padding: 0;
         margin: 0;

         font-size: 14px;
         line-height: 14px;
         font-weight: 500;
         background: none;
         border: none;
         display: inline;

         text-decoration: underline;
         color: #0072ce;

         :hover,
         :focus {
            text-decoration: none;
            color: #0072ce;
         }

         &.gray {
            text-decoration: none;
            color: #999;

            :hover,
            :focus {
               text-decoration: underline;
               color: #999;
            }
         }

      }

      &.dots {
         color: #fff;
         border-color: #cccccc;
         background-color: #cccccc;

         :active,
         :hover,
         :focus,
         :disabled {
            background: #cccccc;
            border-color: #cccccc;
         }
         :after {
            content: '.';
            animation: dots 1s steps(5, end) infinite;
         
            @keyframes dots {
               0%, 20% {
                  color: rgba(0,0,0,0);
                  text-shadow:
                     .3em 0 0 rgba(0,0,0,0),
                     .6em 0 0 rgba(0,0,0,0);
               }
               40% {
                  color: white;
                  text-shadow:
                     .3em 0 0 rgba(0,0,0,0),
                     .6em 0 0 rgba(0,0,0,0);
               }
               60% {
                  text-shadow:
                     .3em 0 0 white,
                     .6em 0 0 rgba(0,0,0,0);
               }
               80%, 100% {
                  text-shadow:
                     .3em 0 0 white,
                     .6em 0 0 white;
               }
            }
         }
      }
      &.bold {
         font-weight: 600;
      }
   }
`

const FormButton = ({ 
   children, 
   type, 
   color = 'blue', 
   disabled = false,
   onClick,
   sending = false,
   size = ''
}) => (
   <CustomButton
      type={type}
      className={`${color} ${size} ${sending ? `dots` : ``}`}
      disabled={disabled}
      onClick={onClick}
      tabIndex='3'
   >
      {sending
         ? `SENDING`
         : children
      }
   </CustomButton>
)

FormButton.propTypes = {
   children: PropTypes.string.isRequired,
   type: PropTypes.string,
   color: PropTypes.string,
   disabled: PropTypes.bool,
   onClick: PropTypes.func,
   sending: PropTypes.bool,
   size: PropTypes.string,
}

export default FormButton
