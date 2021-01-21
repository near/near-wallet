import React from 'react'
import styled from 'styled-components'
import FormButton from '../../common/FormButton'
import GiftIcon from '../../svg/GiftIcon'
import { Translate } from 'react-localize-redux'
import { utils } from 'near-api-js'

const Container = styled.div`
    background-color: #C8F6E0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 20px;
    margin: 0 0 50px -15px;

    div {
        margin-left: 20px;
        color: #005A46;
        flex: 1;
    }

    button {
        border-radius: 6px !important;
        padding: 8px 14px !important;
        height: auto !important;
        width: auto !important;
        font-size: 14px !important;
        letter-spacing: 0.5px !important;
        margin: 0 0 0 auto !important;
    }

    @media (max-width: 767px) {
        margin: -35px -14px 50px -14px;
        border-radius: 0;

        button {
            width: 100% !important;
            margin-top: 25px !important;
        }
    }
`

const LockupAvailTransfer = ({ onTransfer, loading, available }) => {
    return (
        <Container> 
            <GiftIcon/>
            <div><Translate id='profile.lockupBanner.title' data={{ amount: utils.format.formatNearAmount(available, 5) }}/></div>
            <FormButton color='green-dark border' disabled={loading} sending={loading} sendingString='button.transferring' onClick={onTransfer}><Translate id='profile.lockupBanner.cta'/></FormButton>
        </Container>
    )
}

export default LockupAvailTransfer