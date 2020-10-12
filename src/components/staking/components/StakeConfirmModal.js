import React from 'react'
import Modal from '../../common/modal/Modal'
import MobileActionSheet from '../../common/modal/MobileActionSheet'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import ValidatorBox from './ValidatorBox'
import Balance from '../../common/Balance'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-top: 40px;

    @media (min-width: 500px) {
        padding: 40px 25px;
    }

    .validator-box {
        width: 100%;
        max-width: 350px;
    }

    .list {
        font-size: 40px;
        font-family: BwSeidoRound;
        color: #24272a;
        font-weight: 500;
        margin: 50px 0;
    }

    .green {
        margin-top: 50px !important;
        width: 100% !important;
        max-width: 350px !important;
    }

    .link {
        margin-top: 30px !important;
    }

    .ledger-disclaimer {
        font-style: italic;
        margin-top: 50px;
    }

`

const StakeConfirmModal = ({ open, onClose, onConfirm, validatorName, amount, loading, title, disclaimer }) => {
    return (
        <Modal
            id='stake-confirm-modal'
            isOpen={open}
            onClose={onClose}
            closeButton='desktop'
        >
            <Container>
                <MobileActionSheet/>
                <h2><Translate id={title}/></h2>
                <Balance amount={amount} />
                <ValidatorBox validator={validatorName} clickable={false} label={true}/>
                {disclaimer && <div className='ledger-disclaimer'><Translate id={disclaimer}/></div>}
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

export default StakeConfirmModal