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
import GlobalAlert from '../../common/GlobalAlert'
import { Mixpanel } from '../../../mixpanel/index'

const SetupLedger = (props) => {

    const [showInstructions, setShowInstructions] = useState(false);
    const [connect, setConnect] = useState(false);
    const openShowInstructions = () => {
        setShowInstructions(true)
        Mixpanel.track("SR-Ledger See instructions")
    }
    const closeShowInstructions = () => {
        setShowInstructions(false)
        Mixpanel.track("SR-Ledger Close instructions")
    }

    const handleClick = async () => {
        const {
            dispatch,
            location,
            accountId,
        } = props

        setConnect('')
        await Mixpanel.withTracking("SR-Ledger Connect ledger",
            async () => {
                const isNew = await dispatch(checkIsNew(accountId))
                if (isNew) {
                    const fundingOptions = JSON.parse(parseQuery(location.search).fundingOptions || 'null')
                    console.log('SetupLedger', DISABLE_CREATE_ACCOUNT, fundingOptions)
                    const publicKey = await dispatch(getLedgerPublicKey())
                    await setKeyMeta(publicKey, { type: 'ledger' })
                    Mixpanel.track("SR-Ledger Set key meta")
    
                    if (DISABLE_CREATE_ACCOUNT && !fundingOptions) {
                        await dispatch(fundCreateAccountLedger(accountId, publicKey))
                        Mixpanel.track("SR-Ledger Fund create account ledger")
                        return
                    }
    
                    await dispatch(createNewAccount(accountId, fundingOptions, 'ledger', publicKey))
                    Mixpanel.track("SR-Ledger Create new account ledger")
                } else {
                    await dispatch(addLedgerAccessKey())
                    Mixpanel.track("SR-Ledger Add ledger access key")
                }
                await dispatch(refreshAccount())
                if (isNew) {
                    Mixpanel.track("SR-Ledger Go to profile of new account")
                    await dispatch(redirectToApp('/profile'))
                } else {
                    Mixpanel.track("SR-Ledger Go to setup ledger success")
                    await dispatch(redirectTo('/setup-ledger-success'));
                }
            },
            (e) => {
                setConnect('fail');
                throw e;
            }
        )        
    }

    return (
        <Container className='small-centered ledger-theme'>
            {props.localAlert && !props.localAlert.success &&
                <GlobalAlert 
                    globalAlert={{
                        messageCode: `errors.ledger.${props.localAlert.id}`
                    }}
                    closeIcon={false}
                />
            }
            <h1><Translate id='setupLedger.header'/></h1>
            <LedgerIcon/>
            <h2>
                <Translate id='setupLedger.one'/>
                &nbsp;<Translate id='setupLedger.two'/> <span className='link underline' onClick={openShowInstructions}><Translate id='setupLedger.twoLink'/></span>.
            </h2>
            <FormButton onClick={handleClick} sending={props.mainLoader} sendingString='button.connecting'>
                <Translate id={`button.${connect !== 'fail' ? 'continue' : 'retry'}`}/>
            </FormButton>
            <button 
                className='link' 
                onClick={() => 
                {
                    Mixpanel.track("SR-Ledger Click cancel button")
                    props.history.goBack()
                }}>
                    <Translate id='button.cancel'/>
                </button>
            {showInstructions && 
                <InstructionsModal open={showInstructions} onClose={closeShowInstructions}/>
            }
        </Container>
    );
}

const mapStateToProps = ({ account, status }, { match }) => ({
    ...account,
    accountId: match.params.accountId,
    mainLoader: status.mainLoader
})

export const SetupLedgerWithRouter = connect(mapStateToProps)(SetupLedger);
