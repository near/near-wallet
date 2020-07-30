import React, { useState } from 'react';
import { connect } from 'react-redux';
import Theme from './PageTheme.css';
import InstructionsModal from './InstructionsModal';
import LedgerIcon from '../../svg/LedgerIcon';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import { addLedgerAccessKey, clear } from '../../../actions/account'
import GlobalAlert from '../../responsive/GlobalAlert'
import LedgerConfirmActionModal from './LedgerConfirmActionModal'

const SetupLedger = (props) => {

    const [showInstructions, setShowInstructions] = useState(false);
    const [connect, setConnect] = useState(false);
    const toggleShowInstructions = () => setShowInstructions(!showInstructions);

    const onClick = async () => {
        setConnect('true');
        try {
            await props.addLedgerAccessKey(props.accountId)
        } catch (e) {
            return setConnect('fail');
        }
        props.history.push('/setup-ledger-success');
    }

    const { actionsPending } = props

    const showModal = actionsPending.includes('ADD_LEDGER_ACCESS_KEY')

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
            <p><Translate id='setupLedger.two'/> <span className='link underline' onClick={toggleShowInstructions}><Translate id='setupLedger.twoLink'/></span>.</p>
            <FormButton onClick={onClick} sending={connect === 'true'} sendingString='connecting'>
                <Translate id={`button.${connect !== 'fail' ? 'continue' : 'retry'}`}/>
            </FormButton>
            <button className='link' onClick={() => props.history.goBack()}><Translate id='button.cancel'/></button>
            {showInstructions && 
                <InstructionsModal open={showInstructions} onClose={toggleShowInstructions}/>
            }

            {showModal && (
                <LedgerConfirmActionModal 
                    open={true}
                    onClose={() => props.clear()} 
                    textId='confirmLedgerModal.subtext.enableLedger'
                />
            )}
        </Theme>
    );
}

const mapDispatchToProps = {
    addLedgerAccessKey,
    clear
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const SetupLedgerWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupLedger);