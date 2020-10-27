import React from 'react'

import {
    Container
} from 'semantic-ui-react'

import DenyImage from '../../images/icon-deny.svg'
import ProblemsImage from '../../images/icon-problems.svg'
import CheckBlueImage from '../../images/icon-check-blue.svg'

import styled from 'styled-components'

const CustomContainer = styled(Container)`
    &&& {
        .authorize {
            margin-top: 30px;
            height: 48px;

            svg {
                width: 48px;
                height: 48px;
            }
        }
        .cont {
            padding: 0 0 16px 0;

            img {
                height: 24px;
                margin-right: 6px;
            }
            div.item {
                padding-top: 24px;
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
            float: left;

            &.blue {
                float: right;
            }
        }
        button.more-information {
            float: none;
            width: 200px;
            height: 40px;
            cursor: pointer;
            color: #999;
            font-size: 13px;
            border-radius: 20px;
            background: #f8f8f8;
            border: 0px;
            letter-spacing: 0px;

            :hover {
                color: #24272a;
                background: #f8f8f8;
            }
            :focus {
                outline: 0;
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
            }
        }
        .input {
            width: 100%;

            &.problem > input,
            &.problem > input:focus {
                background: url(${ProblemsImage}) right 22px center no-repeat;
                background-size: 24px 24px;
            }
            &.success > input,
            &.success > input:focus {
                background: url(${CheckBlueImage}) right 22px center no-repeat;
                background-size: 24px 24px;
            }
        }
        input {
            width: 100%;
            height: 64px;
            border: 4px solid #f8f8f8;
            padding: 0 0 0 20px;
            font-size: 18px;
            color: #4a4f54;
            font-weight: 400;
            background-color: #f8f8f8;
            position: relative;
            :focus {
                border-color: #f8f8f8;
                background-color: #fff;
            }
            :valid {
                background-color: #fff;
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
        .return-to-app {
            padding: 1rem 0;
            text-align: center;

            button {
                float: none;
                width: 190px;
            }
        }
        
        @media screen and (max-width: 991px) {
            .authorize {
                margin-top: 0px;
                margin-bottom: 0px;
            }
            .but-sec {
                padding-top: 0px;
            }
            .cont {
                h3 {
                    font-size: 14px !important;
                }
                div.item {
                    .content {
                        font-size: 12px;
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

            button {
                width: 140px;
                margin-top: 0px;
            }
            #bottom {
                border-top: 2px solid #f2f2f2;
            }
        }
    }
`

const LoginContainer = ({ children }) => (
    <CustomContainer>
        {children}
    </CustomContainer>
)

export default LoginContainer
