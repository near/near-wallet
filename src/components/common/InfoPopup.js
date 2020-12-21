import React from 'react'
import styled from 'styled-components'
import { Popup } from 'semantic-ui-react'
import InfoIcon from '../svg/InfoIcon.js'

const Trigger = styled.div`
    height: 16px;
    width: 16px;
    display: inline-block;
    margin-left: 10px;

    svg {
        height: 16px;
        width: 16px;

        circle {
            :first-of-type {
                stroke: #999999;
            }
            :last-of-type {
                fill: #999999;
            }
        }

        line {
            stroke: #999999;
        }
    }

    :hover {
        circle {
            :first-of-type {
                stroke: #0072CE;
            }
            :last-of-type {
                fill: #0072CE;
            }
        }
        line {
            stroke: #0072CE;
        }
    }

`

const InfoPopup = ({
    content,
    position = 'top center'
}) => (
    <Popup
        content={content}
        trigger={<Trigger className='popup-trigger'><InfoIcon/></Trigger>}
        position={position}
    />
)

export default InfoPopup