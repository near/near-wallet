import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';

import { Mixpanel } from '../../../mixpanel/index';
import { getLedgerHDPath } from '../../../utils/ledger';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import LedgerIcon from '../../svg/LedgerIcon';
import InstructionsModal from './InstructionsModal';
import LedgerHdPaths from './LedgerHdPaths';

export default ({
    onClickConnectLedger
}) => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [path, setPath] = useState(1);
    const [confirmedPath, setConfirmedPath] = useState(null);
    const customLedgerHdPath = getLedgerHDPath(confirmedPath);
    return (
        <Container className='small-centered border ledger-theme'>
            <h1><Translate id='setupLedger.header' /></h1>
            <LedgerIcon />
            <h2>
                <Translate id='setupLedger.one' />
                &nbsp;<Translate id='setupLedger.two' />
                &nbsp;<span
                    className='link underline'
                    onClick={() => {
                        Mixpanel.track('SR-Ledger See instructions');
                        setShowInstructions(true);
                    }}
                >
                    <Translate id='setupLedger.twoLink' />
                </span>.
            </h2>
            <LedgerHdPaths
                path={path}
                onSetPath={(path) => setPath(path)}
                onConfirmHdPath={() => {
                    setConfirmedPath(path);
                    Mixpanel.track('SR-Ledger Setup set custom HD path');
                }}
            />
            <FormButton onClick={()=>{
                onClickConnectLedger(customLedgerHdPath);
            }}>
                <Translate id='button.continue' />
            </FormButton>
            <FormButton
                className='link red'
                linkTo='/set-recovery-implicit-account'
                trackingId='SR-Ledger Click cancel button'
            >
                <Translate id='button.cancel' />
            </FormButton>
            {showInstructions &&
                <InstructionsModal
                    open={showInstructions}
                    onClose={() => {
                        Mixpanel.track('SR-Ledger Close instructions');
                        setShowInstructions(false);
                    }}
                />
            }
        </Container>
    );
};
