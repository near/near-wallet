import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import InfoIcon from '../../svg/InfoIcon.js'
import { Modal } from 'semantic-ui-react'

const Container = styled.div`

    background-color: #F2F2F2;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    align-items: center;

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
        color: #24272a;
    }
`

export default function StakingFee({ fee }) {
    
    return (
        <Container>
            <Translate id='staking.validator.fee' />
            <Modal
                size='mini'
                trigger={<span className='trigger'><InfoIcon color='#999999'/></span>}
                closeIcon
            >
                <Translate id='staking.validator.fee' />
            </Modal>
            <span className='fee'>{fee}</span>
        </Container>
    )
}