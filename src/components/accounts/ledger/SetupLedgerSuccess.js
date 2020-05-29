import React, { useState } from 'react';
import { connect } from 'react-redux';
import Theme from './PageTheme.css';
import HardwareDeviceIcon from '../../svg/HardwareDeviceIcon';
import NextStepModal from './NextStepModal';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import { removeAllAccessKeys } from '../../../actions/account';

const SetupLedgerSuccess = (props) => {

    const [nextStep, setNextStep] = useState('');
    const removingkeys = props.actionsPending.includes('REMOVE_ALL_ACCESS_KEYS');

    const handleConfirm = () => {
        if (nextStep === 'keep') {
            goToProfile()
        } else if (nextStep === 'remove') {
            props.removeAllAccessKeys()
            .then(() => {
                goToProfile()
            })
        }
    }

    const goToProfile = () => {
        props.history.push(`/profile/${props.accountId}`)
    }

    return (
        <Theme>
            <h1><Translate id='setupLedgerSuccess.header'/></h1>
            <HardwareDeviceIcon/>
            <p><Translate id='setupLedgerSuccess.one'/></p>
            <p className='color-red'><Translate id='setupLedgerSuccess.two'/></p>
            <FormButton onClick={() => setNextStep('remove')}><Translate id='setupLedgerSuccess.primaryCta'/></FormButton>
            <button className='link' onClick={() => setNextStep('keep')}><Translate id='setupLedgerSuccess.secondaryCta'/></button>
            {nextStep && 
                <NextStepModal 
                    nextStep={nextStep} 
                    onClose={() => setNextStep('')}
                    onConfirm={handleConfirm}
                    removingkeys={removingkeys}
                />
            }
        </Theme>
    );
}

const mapDispatchToProps = {
    removeAllAccessKeys
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const SetupLedgerSuccessWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupLedgerSuccess);