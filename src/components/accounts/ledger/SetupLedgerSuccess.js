import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import Theme from './PageTheme.css';
import HardwareDeviceIcon from '../../svg/HardwareDeviceIcon';
import NextStepModal from './NextStepModal';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import { removeNonLedgerAccessKeys, redirectTo } from '../../../actions/account';

const SetupLedgerSuccess = (props) => {

    const [nextStep, setNextStep] = useState('');
    const removingkeys = props.actionsPending.includes('REMOVE_NON_LEDGER_ACCESS_KEYS');
    const { hasLedger } = useSelector(({ ledger }) => ledger);

    const handleConfirm = async () => {
        if (nextStep === 'keep') {
            goToProfile();
        } else if (nextStep === 'remove') {
            if (hasLedger) {
                setNextStep('');
            }

            await props.removeNonLedgerAccessKeys();
            goToProfile();
        }
    };

    const goToProfile = () => {
        props.redirectTo('/profile');
    };

    return (
        <Theme>
            <h1><Translate id='setupLedgerSuccess.header'/></h1>
            <HardwareDeviceIcon/>
            <p><Translate id='setupLedgerSuccess.one'/></p>
            <p className='color-red'><Translate id='setupLedgerSuccess.two'/></p>
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
        </Theme>
    );
};

const mapDispatchToProps = {
    removeNonLedgerAccessKeys,
    redirectTo
};

const mapStateToProps = ({ account }) => ({
    ...account
});

export const SetupLedgerSuccessWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupLedgerSuccess);