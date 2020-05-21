import React, { useState } from 'react';
import { connect } from 'react-redux';
import Theme from './PageTheme.css';
import HardwareDeviceIcon from '../../svg/HardwareDeviceIcon';
import NextStepModal from './NextStepModal';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';

const SetupLedgerSuccess = () => {

    const [nextStep, setNextStep] = useState(false);

    return (
        <Theme>
            <h1><Translate id='setupLedgerSuccess.header'/></h1>
            <HardwareDeviceIcon/>
            <p><Translate id='setupLedgerSuccess.one'/></p>
            <p className='color-red'><Translate id='setupLedgerSuccess.two'/></p>
            <FormButton onClick={() => setNextStep('remove')}><Translate id='setupLedgerSuccess.primaryCta'/></FormButton>
            <button className='link' onClick={() => setNextStep('keep')}><Translate id='setupLedgerSuccess.secondaryCta'/></button>
            {nextStep && 
                <NextStepModal nextStep={nextStep} onClose={() => setNextStep(false)}/>
            }
        </Theme>
    );
}

const mapDispatchToProps = {

}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const SetupLedgerSuccessWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupLedgerSuccess);