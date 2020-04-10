import React from 'react'


import {
    List
} from 'semantic-ui-react'

import styled from 'styled-components'

const CustomList = styled(List)`
    &&&&& {
        width: 360px;
        text-align: center;
        margin: 0 auto 0 auto;
        
        .amount-sent {
            padding: 24px 0 24px 0;
        }
        .confirmed {
            padding-bottom: 12px;
        }
        .cancel {
            font-weight: 600;
            padding-top: 24px;
            padding-left: 0;
            padding-right: 0;
        }
        .goback {
            font-weight: 600;
            padding-top: 24px;
            padding-bottom: 12px;

            button.link {
                background-color: transparent;
                border: none;
                cursor: pointer;
                text-decoration: none;
                display: inline;
                margin: 0;
                padding: 0;
                color: #0072ce;

                :hover,
                :focus {
                    text-decoration: underline;
                    color: #0072ce;
                }
            }
        }
        .sending {
            color: #999999 !important;
        }
        .amount-sending {
            font-family: BwSeidoRound;
            font-size: 48px;
            font-weight: 500;
            line-height: 60px;
            color: #24272a;
            word-break: break-all;
            padding-bottom: 24px;
        }
        .to {
            width: 40px;
            background: #fff;
            margin: -20px auto 12px auto;
        }
        .list-top {
            padding: 24px 24px 36px;
            min-height: 100px;
            margin-top: 14px;

            &.border {
                border-radius: 8px 8px 0 0;
                border: 2px solid #e6e6e6;
                border-bottom: 0px;
            }
            h2 {
                font-size: 24px !important;
            }
        }
        .list-bottom {
            padding: 0 0 12px 0;

            &.border {
                border-radius: 0 0 8px 8px;
                border: 2px solid #e6e6e6;
                border-top: 0px;
            }
            &.go-to-dashboard {
                padding: 12px;
                border: 0px;
                button {
                    margin: 0;
                }
            }
        }
        .send-money {
            padding-bottom: 12px;

            button {
                margin-top: 12px;
            }
        }
        .send-money img {
            width: 24px;
        }

        form {
            h3 {
                margin-bottom: 13px;
                text-align: left;
            }
            .alert-info {
                margin: 0;
                padding: 8px 0;
                line-height: 34px;
                font-size: 14px;
            }
            .amount {
                margin-top: 12px;
                margin-bottom: 0px;
                padding-top: 12px;
            }
            .add-note {
                > textarea {
                    width: 100%;
                    border: 0px;
                    padding: 12px;
                    :focus {
                        border: 0px;
                    }
                }
            }
            .send-money {
                margin-top: 0;
                margin-bottom: 12px;
            }
        }
        @media screen and (max-width: 991px) {
            .cancel {
                font-weight: 600;
                padding-top: 12px;
                background: #f8f8f8;
                padding-bottom: 12px;
            }
            .goback {
                padding-top: 12px;
                padding-bottom: 0px;
                background: #f8f8f8;
            }
            .list-top {
                padding: 12px;
                margin-top: 0px;

                &.border {
                    border: 0px solid #e6e6e6;
                }
            }
            .list-bottom {
                padding: 12px 12px 0;

                &.go-to-dashboard {
                    border-top: 2px solid #f8f8f8;
                }
                &.border {
                    border: 0px;
                }
            }
            form .send-money {
                margin-top: 0px;
                margin-bottom: 0px;
                border-top: 2px solid #f8f8f8;
            }
            .send-money img {
                margin-top: 12px;
            }
            padding: 0px;
            width: 100%;
            text-align: center;
            margin-left: auto;
            margin-right: auto;
            border: 0px;
            form {
                .add-note {
                    margin-left: -1rem;
                    margin-right: -1rem;
                    > textarea {
                        width: 100%;
                        height: 98px;
                        border: 0px;
                        padding: 12px;
                        background: #f8f8f8;
                        :focus {
                            border: 0px;
                        }
                    }
                }
                .alert-info {
                    margin: 25px 0 10px 0;
                }
            }
        }
    }
`

const SendMoneyContainer = ({ children }) => (
    <CustomList>
        {children}
    </CustomList>
)

export default SendMoneyContainer
