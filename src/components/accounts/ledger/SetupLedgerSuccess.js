import React, { useState } from 'react';
import { connect } from 'react-redux';
import Theme from './PageTheme.css';
import HardwareDeviceIcon from '../../svg/HardwareDeviceIcon';
import NextStepModal from './NextStepModal';
import FormButton from '../../common/FormButton';

const SetupLedgerSuccess = () => {

    const [nextStep, setNextStep] = useState(false);

    return (
        <Theme>
            <h1>Ledger has secured your account!</h1>
            <HardwareDeviceIcon/>
            <p>We recommend that you now remove your existing recovery methods and other devices.</p>
            <p className='color-red'>Maintaining multiple recovery methods and devices increases the vulnerability of your account.</p>
            <FormButton onClick={() => setNextStep('remove')}>Remove existing methods</FormButton>
            <button className='link' onClick={() => setNextStep('keep')}>Keep existing methods</button>
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