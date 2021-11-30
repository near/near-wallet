import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { connect, useSelector } from 'react-redux';

import { Mixpanel } from '../../../mixpanel/index';
import { removeNonLedgerAccessKeys, redirectTo } from '../../../redux/actions/account';
import { selectAccountSlice } from '../../../redux/slices/account';
import { selectLedgerHasLedger } from '../../../redux/slices/ledger';
import { actionsPending } from '../../../utils/alerts';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import HardwareDeviceIcon from '../../svg/HardwareDeviceIcon';
import NextStepModal from './NextStepModal';

const SetupLedgerSuccess = (props) => {
    const [nextStep, setNextStep] = useState('');
    const removingkeys = actionsPending('REMOVE_NON_LEDGER_ACCESS_KEYS');
    const hasLedger = useSelector(selectLedgerHasLedger);

    const handleConfirm = async () => {
        if (nextStep === 'keep') {
            goToProfile();
        } else if (nextStep === 'remove') {
            if (hasLedger) {
                setNextStep('');
            }
            Mixpanel.track("SR-Ledger Remove non ledger access keys");
            await props.removeNonLedgerAccessKeys();
            goToProfile();
        }
    };

    const goToProfile = () => {
        Mixpanel.track("SR-Ledger Go to profile page with ledger");
        props.redirectTo('/profile');
    };

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
};

const mapDispatchToProps = {
    removeNonLedgerAccessKeys,
    redirectTo
};

const mapStateToProps = (state) => ({
    ...selectAccountSlice(state)
});

export const SetupLedgerSuccessWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupLedgerSuccess);