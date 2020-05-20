import React, { useState } from 'react';
import { connect } from 'react-redux';
import Theme from './PageTheme.css';
import InstructionsModal from './InstructionsModal';
import LedgerIcon from '../../svg/LedgerIcon';
import FormButton from '../../common/FormButton';

const SetupLedger = () => {

    const [showInstructions, setShowInstructions] = useState(false);
    const toggleShowInstructions = () => setShowInstructions(!showInstructions);

    return (
        <Theme>
            <h1>Connect your Ledger device</h1>
            <LedgerIcon/>
            <p>To enable a Ledger hardware wallet to maintain custody of your account, connect your Ledger device to your computer and open the NEAR app.</p>
            <p>If you have not yet installed the NEAR application on your device, follow <span className='link' onClick={toggleShowInstructions}>these instructions</span>.</p>
            <FormButton>Connect to ledger</FormButton>
            <button className='link'>Cancel</button>
            {showInstructions && 
                <InstructionsModal open={showInstructions} onClose={toggleShowInstructions}/>
            }
        </Theme>
    );
}

const mapDispatchToProps = {

}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const SetupLedgerWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupLedger);