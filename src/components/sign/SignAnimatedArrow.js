import React from 'react'

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

const SendImage = () => (
    <svg viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg"><g stroke="#8dd4bd"><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m19 10h-18" /><path d="m19 28h-18" /><path d="m19 1 18 18-18 18" /></g><path d="m2.5 20.5a1.36 1.36 0 0 1 -.29 0l-.28-.08-.26-.14a2.11 2.11 0 0 1 -.23-.19 2.11 2.11 0 0 1 -.19-.23 1.26 1.26 0 0 1 -.13-.26 1.31 1.31 0 0 1 -.12-.31 1.42 1.42 0 0 1 0-.58 1.31 1.31 0 0 1 .09-.28 1.26 1.26 0 0 1 .13-.26 2.11 2.11 0 0 1 .19-.23 2.11 2.11 0 0 1 .23-.19l.26-.14.28-.08a1.42 1.42 0 0 1 .58 0l.28.08.26.14a2.11 2.11 0 0 1 .23.19 2.11 2.11 0 0 1 .19.23 2.15 2.15 0 0 1 .14.26 2.29 2.29 0 0 1 .08.28 1.42 1.42 0 0 1 0 .58 2.29 2.29 0 0 1 -.08.28 2.15 2.15 0 0 1 -.14.26 2.11 2.11 0 0 1 -.19.23 1.52 1.52 0 0 1 -1.03.44z" fill="#8dd4bd" strokeMiterlimit="10" /><path d="m14.5 20.5a1.52 1.52 0 0 1 -1.06-.44 2.11 2.11 0 0 1 -.19-.23 1.26 1.26 0 0 1 -.13-.26 1.31 1.31 0 0 1 -.09-.28 1.42 1.42 0 0 1 0-.58 1.31 1.31 0 0 1 .09-.28 1.26 1.26 0 0 1 .13-.26 1.57 1.57 0 0 1 .42-.42l.26-.14.28-.08a1.42 1.42 0 0 1 .58 0l.28.08.26.14a1.57 1.57 0 0 1 .42.42 1.26 1.26 0 0 1 .13.26 1.31 1.31 0 0 1 .09.28 1.42 1.42 0 0 1 0 .58 1.31 1.31 0 0 1 -.09.28 1.26 1.26 0 0 1 -.13.26 2.11 2.11 0 0 1 -.19.23 1.52 1.52 0 0 1 -1.06.44z" fill="#8dd4bd" strokeMiterlimit="10" /><path d="m26.5 20.5a1.52 1.52 0 0 1 -1.06-.44 2.11 2.11 0 0 1 -.19-.23 2.15 2.15 0 0 1 -.14-.26 2.29 2.29 0 0 1 -.08-.28 1.42 1.42 0 0 1 0-.58 2.29 2.29 0 0 1 .08-.28 2.15 2.15 0 0 1 .14-.26 1.57 1.57 0 0 1 .42-.42l.26-.14.28-.08a1.42 1.42 0 0 1 .58 0l.28.08.26.14a1.57 1.57 0 0 1 .42.42 1.26 1.26 0 0 1 .13.26 1.31 1.31 0 0 1 .09.28 1.42 1.42 0 0 1 0 .58 1.31 1.31 0 0 1 -.09.28 1.26 1.26 0 0 1 -.13.26 1.57 1.57 0 0 1 -.42.42l-.26.14-.28.08a1.36 1.36 0 0 1 -.29.03z" fill="#8dd4bd" strokeMiterlimit="10" /></g></svg>
)

const SignAnimatedArrow = ({ start, pending, end }) => (
    <CustomDiv>
        <div className='sep'>
            <div className={`${start ? `start` : ``}`} />
        </div>
        <SendImage className={`${start ? `pending-start` : ``} ${pending ? `pending` : ``} ${end ? `pending-end` : ``}`} />
        <div className='sep'>
            <div className={`${end ? `end` : ``}`} />
        </div>
    </CustomDiv>
)

export default SignAnimatedArrow
