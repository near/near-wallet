import React from 'react'
import styled from 'styled-components'
import GiftImage from '../../../images/gift-image.svg'
import FormButton from '../../common/FormButton'
import Balance from '../../common/Balance'

const Container = styled.div`
    background-color: #C8F6E0;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 -14px;
    margin-top: 30px;
    padding: 24px;

    @media (max-width: 767px) {
        margin: 30px 0 0 0;
    }

    div {
        margin: 30px 0 20px 0;
        font-size: 16px;
        text-align: center;
        max-width: 300px;
        line-height: 170%;
    }

    button {
        width: 100% !important;
    }
`

const LockupAvailTransfer = ({ onTransfer, loading, available }) => {
    return (
        <Container> 
            <img src={GiftImage} alt='UNLOCKED NEAR'/>
            <div>You have <b><Balance amount={available} symbol='near'/></b> available to withdraw from your lockup!</div>
            <FormButton color='green-dark' disabled={loading} sendingString='Transferring from Lockup' onClick={onTransfer}>Transfer to Wallet</FormButton>
        </Container>
    )
}

export default LockupAvailTransfer