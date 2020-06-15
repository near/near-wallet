import React, { useState } from 'react';
import { connect } from 'react-redux';
import Theme from './PageTheme.css';
import InstructionsModal from './InstructionsModal';
import LedgerIcon from '../../svg/LedgerIcon';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import { addLedgerAccessKey } from '../../../actions/account'
import GlobalAlert from '../../responsive/GlobalAlert'

const SetupLedger = (props) => {

    const [showInstructions, setShowInstructions] = useState(false);
    const [connect, setConnect] = useState(false);
    const toggleShowInstructions = () => setShowInstructions(!showInstructions);

    const onClick = () => {
        setConnect('true');
        props.addLedgerAccessKey(props.accountId)
            .then(({ error }) => {
                if (error) {
                    return setConnect('fail');
                }
                props.history.push('/setup-ledger-success');
            })
    }

    return (
        <Theme>
            {props.requestStatus &&
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
            <p><Translate id='setupLedger.two'/> <span className='link' onClick={toggleShowInstructions}><Translate id='setupLedger.twoLink'/></span>.</p>
            <FormButton onClick={onClick} sending={connect === 'true'} sendingString='connecting'>
                <Translate id={`button.${connect !== 'fail' ? 'connectLedger' : 'retry'}`}/>
            </FormButton>
            <button className='link' onClick={() => props.history.goBack()}><Translate id='button.cancel'/></button>
            {showInstructions && 
                <InstructionsModal open={showInstructions} onClose={toggleShowInstructions}/>
            }
        </Theme>
    );
}

const mapDispatchToProps = {
    addLedgerAccessKey
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const SetupLedgerWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupLedger);