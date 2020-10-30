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

    .stake-amount {
        font-size: 40px;
        color: #24272a;
        font-weight: 500;
        margin: 40px 0 !important;
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
        max-width: 350px;
    }

    .divider {
        width: 100%;
        border-top: 1px solid #F2F2F2;
        position: relative;
        margin-bottom: 40px;
        max-width: 350px;

        div {
            background-color: white;
            padding: 0 10px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
        }
    }

`

const StakeConfirmModal = ({ open, onClose, onConfirm, validator, amount, loading, title, disclaimer, label }) => {
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
                <Balance amount={amount || '0'} className='stake-amount'/>
                {label && <div className='divider'><div><Translate id={label}/></div></div>}
                <ValidatorBox 
                    validator={validator.accountId}
                    fee={validator.fee.percentage}
                    clickable={false}
                    amount={validator.staked}
                />
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