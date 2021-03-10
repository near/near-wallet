import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import Tooltip from '../../common/Tooltip'

const Container = styled.div`
    background-color: #FFF0DE;
    color: #A15600;
    font-weight: 600;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 13px;

    .tooltip {
        svg {
            path {
                stroke: #ef860d;
            }
        }

        :hover {
            svg {
                path {
                    stroke: #A15600;
                }
            }
        }
    }

    .fee {
        margin-left: auto;
        color: #452500;
    }
`

export default function StakingFee({ fee }) {
    
    return (
        <Container>
            <Translate id='staking.validator.fee' />
            <Tooltip translate='staking.validator.desc'/>
            <span className='fee'>{fee}%</span>
        </Container>
    )
}