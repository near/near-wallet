import React, { useState } from 'react';
import { connect } from 'react-redux';
import Container from './Style.css';
import Modal from "../../common/modal/Modal";

const SetupLedger = () => {

    const [showInstructions, setShowInstructions] = useState(false);
    const toggleShowInstructions = () => setShowInstructions(!showInstructions);

    return (
        <Container>
            <div onClick={toggleShowInstructions}>these instructions</div>
            {showInstructions &&
                <Modal
                    id='instructions-modal'
                    isOpen={showInstructions}
                    onClose={toggleShowInstructions}
                    closeButton={true}
                >
                    <div>Install NEAR on your Ledger device</div>
                </Modal>
            }
        </Container>
    );
}

const mapDispatchToProps = {

}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const SetupLedgerWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupLedger);