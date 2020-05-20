import React from 'react';
import { connect } from 'react-redux';
import Theme from './PageTheme.css';
import Modal from "../../common/modal/Modal";

const SetupLedgerSuccess = () => {
    return (
        <Theme>
            Ledger has secured your account
        </Theme>
    );
}

const mapDispatchToProps = {

}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const SetupLedgerSuccessWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupLedgerSuccess);