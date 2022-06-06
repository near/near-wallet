import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../common/FormButton';
import Modal from '../../common/modal/Modal';

const Container = styled.div`
    &&&&& {
        padding: 15px 0 10px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        h3 {
            margin: 15px 0;
        }

        > button {
            margin-top: 25px;
            width: 100%;
        }
    }
`;

export function AddLedgerKeyModal({
    isOpen,
    onClickAddLedgerKey,
    onClose,
    finishingLedgerKeySetup
}) {
    return (
        <Modal
            id='add-ledger-key-modal'
            isOpen={isOpen}
            onClose={onClose}
            modalSize='sm'
        >
            <Container>
                <h3><Translate id='zeroBalance.ledgerModal.title' /></h3>
                {
                    finishingLedgerKeySetup
                    ? <p><Translate id='zeroBalance.ledgerModal.confirmOnLedger' /></p>
                    : <p><Translate id='zeroBalance.ledgerModal.desc' /></p>
                }
                <FormButton
                    onClick={onClickAddLedgerKey}
                    sending={finishingLedgerKeySetup}
                    disabled={finishingLedgerKeySetup}
                >
                    <Translate id='zeroBalance.ledgerModal.addLedgerKey' />
                </FormButton>
            </Container>
        </Modal>
    );
};
