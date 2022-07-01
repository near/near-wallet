import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';

import { Mixpanel } from '../../../mixpanel/index';
import { LEDGER_HD_PATH_PREFIX } from '../../../redux/slices/ledger';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import LedgerIcon from '../../svg/LedgerIcon';
import InstructionsModal from './InstructionsModal';
import LedgerHdPaths from './LedgerHdPaths';

export default ({
    onClickConnectLedger
}) => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [confirmedPath, setConfirmedPath] = useState(1);
    const ledgerHdPath = `${LEDGER_HD_PATH_PREFIX}${confirmedPath}'`;
    return (
        <Container className='small-centered border ledger-theme'>
            <h1><Translate id='setupLedger.header' /></h1>
            <LedgerIcon />
            <h2>
                <Translate id='setupLedger.one' />
                &nbsp;<Translate id='setupLedger.two' />
                &nbsp;
                <span
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
                confirmedPath={confirmedPath}
                setConfirmedPath={(path) => {
                    setConfirmedPath(path);
                    Mixpanel.track('SR-Ledger Setup set custom HD path');
                }}
            />
            <FormButton onClick={()=>{
                onClickConnectLedger(ledgerHdPath);
            }}
            >
                <Translate id='button.continue' />
            </FormButton>
            <FormButton
                className='link red'
                linkTo='/set-recovery-implicit-account'
                trackingId='SR-Ledger Click cancel button'
            >
                <Translate id='button.cancel' />
            </FormButton>
            {showInstructions && (
                <InstructionsModal
                    open={showInstructions}
                    onClose={() => {
                        Mixpanel.track('SR-Ledger Close instructions');
                        setShowInstructions(false);
                    }}
                />
            )}
        </Container>
    );
};
