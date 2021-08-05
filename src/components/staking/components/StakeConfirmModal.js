import React from 'react';
import { Translate } from 'react-localize-redux';
import { Textfit } from 'react-textfit';
import styled from 'styled-components';

import Balance from '../../common/balance/Balance';
import FormButton from '../../common/FormButton';
import Modal from '../../common/modal/Modal';
import ValidatorBox from './ValidatorBox';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-top: 40px;

    h2 {
        color: #24272a !important;
    }

    @media (min-width: 500px) {
        padding: 40px 25px;
    }

    .validator-box {
        width: 100%;
        max-width: 400px;

        .left {
            > div {
                :first-of-type {
                    max-width: 150px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: left;
                }
            }
        }
    }

    .amount {
        width: 100%;
        max-width: 400px;
    }

    .stake-amount {
        color: #24272a;
        font-weight: 500;
        margin: 40px 0 !important;

        .fiat-amount {
            font-size: 14px;
        }
    }

    .green {
        margin-top: 50px !important;
        width: 100%;
        max-width: 400px;
    }

    .link {
        margin-top: 30px !important;
    }

    .ledger-disclaimer {
        font-style: italic;
        margin-top: 50px;
        max-width: 400px;
    }

    .divider {
        width: 100%;
        border-top: 1px solid #F2F2F2;
        position: relative;
        margin-bottom: 40px;
        max-width: 400px;

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

`;

const StakeConfirmModal = ({ open, onClose, onConfirm, validator, amount, loading, title, disclaimer, label, sendingString }) => {
    return (
        <Modal
            id='stake-confirm-modal'
            isOpen={open}
            onClose={onClose}
            closeButton='desktop'
        >
            <Container>
                <h2><Translate id={title}/></h2>
                <Textfit mode='single' max={40} className='amount'>
                    <Balance amount={amount} className='stake-amount'/>
                </Textfit>
                {label && <div className='divider'><div><Translate id={label}/></div></div>}
                <ValidatorBox 
                    validator={validator}
                    clickable={false}
                    amount={validator.staked}
                />
                {disclaimer && <div className='ledger-disclaimer'><Translate id={disclaimer}/></div>}
                <FormButton 
                    disabled={loading}
                    sending={loading}
                    color='green'
                    onClick={onConfirm}
                    sendingString={`button.${sendingString}`}
                >
                    <Translate id='button.confirm'/>
                </FormButton>
                <FormButton disabled={loading} color='link red' id='close-button'>
                    <Translate id='button.cancel'/>
                </FormButton>
            </Container>
        </Modal>
    );
};

export default StakeConfirmModal;