import React from 'react'
import styled from 'styled-components'

const CustomSvg = styled.svg`
    &&& {
        width: 30px;
        margin: 0px;

        polyline {
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
        <polyline points="10 20.5 16 26.5 28 11.5"/>
    </CustomSvg>
)
