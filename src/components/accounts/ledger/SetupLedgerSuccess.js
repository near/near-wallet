import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import Container from '../../common/styled/Container.css';
import HardwareDeviceIcon from '../../svg/HardwareDeviceIcon';
import NextStepModal from './NextStepModal';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import { removeNonLedgerAccessKeys, redirectTo } from '../../../actions/account';

const SetupLedgerSuccess = (props) => {

    const [nextStep, setNextStep] = useState('');
    const removingkeys = props.actionsPending.includes('REMOVE_NON_LEDGER_ACCESS_KEYS');
    const { hasLedger } = useSelector(({ ledger }) => ledger)

    const handleConfirm = async () => {
        if (nextStep === 'keep') {
            goToProfile()
        } else if (nextStep === 'remove') {
            if (hasLedger) {
                setNextStep('')
            }

            await props.removeNonLedgerAccessKeys()
            goToProfile()
        }
    }

    const goToProfile = () => {
        props.redirectTo('/profile')
    }

    return (
        <Container className='small-centered ledger-theme'>
            <h1><Translate id='setupLedgerSuccess.header'/></h1>
            <HardwareDeviceIcon/>
            <h2>
                <Translate id='setupLedgerSuccess.one'/><br/>
                <div className='color-red' style={{ marginTop: '10px' }}><Translate id='setupLedgerSuccess.two'/></div>
            </h2>
            <FormButton 
                sending={removingkeys} 
                onClick={() => setNextStep('remove')}
                className='remove-all-keys'
            >
                <Translate id='setupLedgerSuccess.primaryCta'/>
            </FormButton>
            <button className='link' onClick={() => setNextStep('keep')}><Translate id='setupLedgerSuccess.secondaryCta'/></button>
            {nextStep && 
                <NextStepModal 
                    nextStep={nextStep} 
                    onClose={() => setNextStep('')}
                    onConfirm={handleConfirm}
                    removingkeys={removingkeys}
                />
            }
        </Container>
    );
}

const mapDispatchToProps = {
    removeNonLedgerAccessKeys,
    redirectTo
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const SetupLedgerSuccessWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupLedgerSuccess);