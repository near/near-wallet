import React from 'react'

import { Container } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomContainer = styled(Container)`
    &&& {
        margin-top: 30px;
        padding-bottom: 50vh;

        @media (min-width: 768px) {
            margin-top: 50px;
            padding-bottom: 0;
        }

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
            }
        }
        .sub {
            color: #24272a;
            padding-top: 0;
        }
        .contract {
            font-size: 12px;
            padding: 0px;
            .column {
                padding: 12px 0;
            }
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
                margin-bottom: 0;
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
        }
    }
`

const SignContainer = ({ children }) => (
    <CustomContainer>
        {children}
    </CustomContainer>
)

export default SignContainer
