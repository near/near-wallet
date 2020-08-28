import React, { useState } from 'react';
import { connect } from 'react-redux';
import Theme from './PageTheme.css';
import InstructionsModal from './InstructionsModal';
import LedgerIcon from '../../svg/LedgerIcon';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import { addLedgerAccessKey, createNewAccount, refreshAccount, redirectToApp, getLedgerPublicKey } from '../../../actions/account'
import GlobalAlert from '../../responsive/GlobalAlert'

const SetupLedger = (props) => {

    const [showInstructions, setShowInstructions] = useState(false);
    const [connect, setConnect] = useState(false);
    const toggleShowInstructions = () => setShowInstructions(!showInstructions);

    const handleClick = async () => {
        setConnect('')

        try {
            // TODO: No need for separate Redux action, just move inside of createNewAccount and addLedgerAccessKey
            const ledgerPublicKey = await props.getLedgerPublicKey()
            if (props.isNew) {
                const useLedger = true
                await props.createNewAccount(props.accountId, props.fundingContract, props.fundingKey, ledgerPublicKey, useLedger)
            } else {
                await props.addLedgerAccessKey(props.accountId, ledgerPublicKey)
            }
            await props.refreshAccount()
        } catch(e) {
            setConnect('fail');
            throw e;
        } 

        if (props.isNew) {
            props.redirectToApp('/profile')
        } else {
            props.history.push('/setup-ledger-success');
        }
    }

    return (
        <Theme>
            {props.requestStatus && !props.requestStatus.success &&
                <GlobalAlert 
                    globalAlert={{
                        messageCode: `errors.ledger.${props.requestStatus.id}`
                    }}
                    closeIcon={false}
                />
            }
            <h1><Translate id='setupLedger.header'/></h1>
            <LedgerIcon/>
            <p><Translate id='setupLedger.one'/></p>
            <p><Translate id='setupLedger.two'/> <span className='link underline' onClick={toggleShowInstructions}><Translate id='setupLedger.twoLink'/></span>.</p>
            <FormButton onClick={handleClick} sending={props.formLoader} sendingString='connecting'>
                <Translate id={`button.${connect !== 'fail' ? 'continue' : 'retry'}`}/>
            </FormButton>
            <button className='link' onClick={() => props.history.goBack()}><Translate id='button.cancel'/></button>
            {showInstructions && 
                <InstructionsModal open={showInstructions} onClose={toggleShowInstructions}/>
            }
        </Theme>
    );
}

const mapDispatchToProps = {
    addLedgerAccessKey,
    createNewAccount,
    refreshAccount,
    redirectToApp,
    getLedgerPublicKey
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    accountId: match.params.accountId,
    isNew: !!parseInt(match.params.isNew),
    fundingContract: match.params.fundingContract,
    fundingKey: match.params.fundingKey,
})

export const SetupLedgerWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupLedger);
