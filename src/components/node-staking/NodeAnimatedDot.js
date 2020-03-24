import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

const CustomDiv = styled(`div`)`
    width: 14px;
    height: 14px;
    border-radius: 100%;
    border: 2px solid #24272a;

    animation-duration: 1.2s;
    animation-iteration-count: infinite;

    &.green {
        animation-name: node-pulse-green;
        background-color: #8fd6bd;

        @keyframes node-pulse-green {
            0% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(143, 214, 189, 0.8);
                opacity: 0.8;
            }
            60% {
                transform: scale(1.05);
                box-shadow: 0 0 0 4px rgba(143, 214, 189, 0);
                opacity: 1;
            }
            100% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(143, 214, 189, 0);
                opacity: 0.8;
            }
        }
    }
    &.red {
        animation-name: node-pulse-red;
        background-color: #ff585d;

        @keyframes node-pulse-red {
            0% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(255, 88, 93, 0.8);
                opacity: 0.8;
            }
            60% {
                transform: scale(1.05);
                box-shadow: 0 0 0 4px rgba(255, 88, 93, 0);
                opacity: 1;
            }
            100% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(255, 88, 93, 0);
                opacity: 0.8;
            }
        }
    }
`

const NodeAnimatedDot = ({ color = 'red' }) => (
    <CustomDiv className={`node-dot ${color}`} />
)

NodeAnimatedDot.propTypes = {
    color: PropTypes.string
}

export default NodeAnimatedDot
