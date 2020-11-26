import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import InfoIcon from '../../svg/InfoIcon.js'
import { Modal } from 'semantic-ui-react'

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

    .trigger {
        margin-left: 10px;
        svg {
            width: 16px;
            height: 16px;
            margin-bottom: -3px;
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
            <Modal
                size='mini'
                trigger={<span className='trigger'><InfoIcon color='#EF860D'/></span>}
                closeIcon
            >
                <Translate id='staking.validator.desc' />
            </Modal>
            <span className='fee'>{fee}%</span>
        </Container>
    )
}