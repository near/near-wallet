import React from 'react';
import { connect } from 'react-redux';
import Container from './Style.css';
import Modal from "../../common/modal/Modal";

const SetupLedgerSuccess = () => {
    return (
        <Container>
            Ledger has secured your account
        </Container>
    );
}

const mapDispatchToProps = {

}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const SetupLedgerSuccessWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupLedgerSuccess);