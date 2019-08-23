import React from 'react'

import { ReactComponent as SendImage } from '../../images/icon-send.svg'

import styled from 'styled-components'

const CustomDiv = styled(`div`)`
   &&& {
      display: flex;
      justify-content: center;
      padding: 0 0;
      
      div, svg {
         float: left;
      }
      .sep {
         width: 20px;
         margin: 22px 8px 0 8px;

         > div {
            height: 3px;
            border-top: 1px solid #ace6c1;
            border-bottom: 1px solid #ace6c1;
            background: #5ace84;
            opacity: 0;
         }
      }
      img {
         width: 48px;
         margin: 0 auto;
      }
      svg {
         width: 48px;
         height: 48px;

         > g {
            stroke: #999;

            > path {
               stroke: #999;
               fill: #999;
            }
         }
      }
      .start,
      .end {
         opacity: 0;
         animation-duration: .5s;
         animation-iteration-count: 1;
         animation-fill-mode: forwards;
      }
      .start {
         animation-name: Anm1;
      }
      .end {
         animation-name: Anm3;
      }
      @keyframes Anm1 {
         from {
            opacity: 0;
            width: 0;
         }
         to {
            opacity: 1;
            width: 20px;
         }
      }
      @keyframes Anm3 {
         from {
            opacity: 0;
            width: 0;
         }
         to {
            opacity: 1;
            width: 20px;
         }
      }
      .pending-start {
         > g {
            > path {
               stroke: #fff;
               fill: #fff;
            }
         }
      }
      .pending {
         > g {
            > path {
               stroke: #fff;
               fill: #fff;
               animation-iteration-count: infinite;
               animation-fill-mode: forwards;
               animation-duration: 1.0s;
               animation-delay: 0.5s;
            }
            > path:nth-child(2) {
               animation-name: fadeInDots1;
            }
            > path:nth-child(3) {
               animation-name: fadeInDots2;
            }
            > path:nth-child(4) {
               animation-name: fadeInDots3;
            }
         }
         &.pending-end {
            > g {
               > path {
                  animation-iteration-count: 1;
               }
            }
         }
      }
      @keyframes fadeInDots1 {
         0% {
            stroke: #fff;
            fill: #fff;
         }
         33% {
            stroke: #5ace84;
            fill: #5ace84;
         }
         66% {
            stroke: #5ace84;
            fill: #5ace84;
         }
         100% {
            stroke: #5ace84;
            fill: #5ace84;
         }
      }
      @keyframes fadeInDots2 {
         0% {
            stroke: #fff;
            fill: #fff;
         }
         33% {
            stroke: #fff;
            fill: #fff;
         }
         66% {
            stroke: #5ace84;
            fill: #5ace84;
         }
         100% {
            stroke: #5ace84;
            fill: #5ace84;
         }
      }
      @keyframes fadeInDots3 {
         0% {
            stroke: #fff;
            fill: #fff;
         }
         33% {
            stroke: #fff;
            fill: #fff;
         }
         66% {
            stroke: #fff;
            fill: #fff;
         }
         100% {
            stroke: #5ace84;
            fill: #5ace84;
         }
      }
   }
`

const SignAnimatedArrow = ({ start, pending, end }) => (
   <CustomDiv>
      <div className='sep'>
         <div className={`${start ? `start` : ``}`} />
      </div>
      <SendImage className={`${start ? `pending-start` : ``} ${pending ? `pending` : ``} ${end ? `pending-end` : ``}`} />
      <div className='sep'>
         <div className={`${end ? `end` : `` }`} />
      </div>
   </CustomDiv>
)

export default SignAnimatedArrow
