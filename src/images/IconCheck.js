import React from 'react'
import styled from 'styled-components'

const CustomSvg = styled.svg`
    &&& {
        width: 26px;
        margin: 0px;

        .cls-1{
            fill: none;
            stroke: ${props => props.color};
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: ${props => props.stroke || '2px'};
        }
    }
`

export default ({ color, stroke }) => (
    <CustomSvg color={color} stroke={stroke} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38">
        <title>icon-check</title>
        <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
                <circle className="cls-1" cx="19" cy="19" r="18"/>
                <polyline className="cls-1" points="10 20.5 16 26.5 28 11.5"/>
            </g>
        </g>
    </CustomSvg>
)
