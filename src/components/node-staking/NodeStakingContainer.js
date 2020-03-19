import React from 'react'

import { Container } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomContainer = styled(Container)`
    &&&& {
        .page-title {
            border: 0px;

            .add {
                h1 {
                    font-size: 20px !important;
                }
            }
        }
        .node{
            :hover {
                text-decoration: none;
            }
        }
        .arrow {
            height: 22px;
            margin: 4px 0 0 12px;
        }
        .node-dot {
            float: right;
            width: 26px;
            height: 26px;
            border: 1px solid #ebebeb;
            border-radius: 100%;
            padding: 4px;
            margin: 2px 0 0 0;

            > div {
                width: 100%;
                height: 100%;
                border-radius: 100%;
            }
            .green {
                background: #8fd6bd;
            }
            .red {
                background: #ff585d;
            }
        }
        .box {
            margin-top: 18px !important;
        }
        .svg {
            float: left;
            padding: 0 12px 0 0;

            svg {
                width: 26px;
                height: 26px;

                > g {
                    stroke: #cccccc;

                    > path {
                        stroke: #cccccc;
                        fill: #cccccc;
                    }
                }

            }
        }
        svg.recent {
            width: 22px;
            height: 22px;

            > g {
                stroke: #cccccc;

                > path {
                    stroke: #cccccc;
                    fill: #cccccc;
                }
            }
        }

        @media screen and (max-width: 991px) {
            .page-title {
                .add {
                    h1 {
                        font-size: 11px !important;
                    }
                }
            }
        }

        @media screen and (max-width: 767px) {
            
        }
    }
`

const NodeStakingContainer = ({ children }) => (
    <CustomContainer>
        {children}
    </CustomContainer>
)

export default NodeStakingContainer
