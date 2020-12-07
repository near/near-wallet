import React, { useState } from 'react';
import { connect } from 'react-redux';
import { parse as parseQuery } from 'query-string';
import Container from '../../common/styled/Container.css';
import InstructionsModal from './InstructionsModal';
import LedgerIcon from '../../svg/LedgerIcon';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import {
    addLedgerAccessKey,
    createNewAccount,
    refreshAccount,
    redirectToApp,
    redirectTo,
    checkIsNew,
    fundCreateAccountLedger,
    getLedgerPublicKey
} from '../../../actions/account'
import { DISABLE_CREATE_ACCOUNT, setKeyMeta } from '../../../utils/wallet'
import GlobalAlert from '../../responsive/GlobalAlert'

const SetupLedger = (props) => {

    const [showInstructions, setShowInstructions] = useState(false);
    const [connect, setConnect] = useState(false);
    const toggleShowInstructions = () => setShowInstructions(!showInstructions);

    const handleClick = async () => {
        const {
            dispatch,
            location,
            accountId,
        } = props

        setConnect('')
        const isNew = await dispatch(checkIsNew(accountId))
        try {
            if (isNew) {
                const fundingOptions = JSON.parse(parseQuery(location.search).fundingOptions || 'null')
                console.log('SetupLedger', DISABLE_CREATE_ACCOUNT, fundingOptions)
                const publicKey = await dispatch(getLedgerPublicKey())
                await setKeyMeta(publicKey, { type: 'ledger' })

                if (DISABLE_CREATE_ACCOUNT && !fundingOptions) {
                    await dispatch(fundCreateAccountLedger(accountId, publicKey))
                    return
                }

                await dispatch(createNewAccount(accountId, fundingOptions, 'ledger', publicKey))
            } else {
                await dispatch(addLedgerAccessKey())
            }
            await dispatch(refreshAccount())
        } catch(e) {
            setConnect('fail');
            throw e;
        } 

        if (isNew) {
            await dispatch(redirectToApp('/profile'))
        } else {
            await dispatch(redirectTo('/setup-ledger-success'));
        }
    }

    return (
        <Container className='small-centered ledger-theme'>
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
            <h2>
                <Translate id='setupLedger.one'/>
                &nbsp;<Translate id='setupLedger.two'/> <span className='link underline' onClick={toggleShowInstructions}><Translate id='setupLedger.twoLink'/></span>.
            </h2>
            <FormButton onClick={handleClick} sending={props.formLoader} sendingString='connecting'>
                <Translate id={`button.${connect !== 'fail' ? 'continue' : 'retry'}`}/>
            </FormButton>
            <button className='link' onClick={() => props.history.goBack()}><Translate id='button.cancel'/></button>
            {showInstructions && 
                <InstructionsModal open={showInstructions} onClose={toggleShowInstructions}/>
            }
        </Container>
    );
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    accountId: match.params.accountId,
})

export const SetupLedgerWithRouter = connect(mapStateToProps)(SetupLedger);
