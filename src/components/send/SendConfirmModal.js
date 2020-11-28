import React from 'react'
import Modal from '../common/modal/Modal'
import MobileActionSheet from '../common/modal/MobileActionSheet'
import FormButton from '../common/FormButton'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import Balance from '../common/Balance'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-top: 40px;

    @media (min-width: 500px) {
        padding: 40px 25px;
    }

    .green {
        margin-top: 50px !important;
        width: 100% !important;
        max-width: 350px !important;
    }

    .link {
        margin-top: 30px !important;
    }

`

const SendConfirmModal = ({ open, onClose, onConfirm, amount, accountId, loading }) => {
    return (
        <Modal
            id='stake-confirm-modal'
            isOpen={open}
            onClose={onClose}
            closeButton='desktop'
        >
            <Container>
                <MobileActionSheet/>
                <h2><Translate id='sendMoney.confirmModal.title'/></h2>
                <div>
                    Amount to send
                    <Balance amount={amount || '0'}/>
                </div>
                <div>
                    Recipient
                    <div>{accountId}</div>
                </div>
                <FormButton disabled={loading} sending={loading} color='green' onClick={onConfirm}>
                    <Translate id='button.confirm'/>
                </FormButton>
                <FormButton disabled={loading} color='link red' id='close-button'>
                    <Translate id='button.cancel'/>
                </FormButton>
            </Container>
        </Modal>
    );
}

export default SendConfirmModal