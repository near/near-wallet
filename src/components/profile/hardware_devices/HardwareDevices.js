import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import Card from '../../common/styled/Card.css';

import FormButton from '../../common/FormButton';
import HardwareDeviceIcon from '../../svg/HardwareDeviceIcon';
import { 
    getAccessKeys,
    disableLedger,
    getLedgerKey,
    addLedgerAccessKey
} from '../../../actions/account';
import { useRecoveryMethods } from '../../../hooks/recoveryMethods';
import ConfirmDisable from './ConfirmDisable';

const Container = styled(Card)`
    margin-top: 30px;

    .header {
        display: flex;
        align-items: center;

        svg {
            width: 28px;
            height: 28px;
            margin: -5px 10px 0 0;

            path {
                stroke: #CCCCCC;
            }
        }
    }

    .font-rounded {
        margin-top: 15px;
        font-weight: 500;
    }

    .device {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 2px solid #f8f8f8;
        margin: 20px -20px 0 -20px;
        padding: 20px 20px 0 20px;

        .name {
            font-weight: 500;
            color: #24272a;

            div {
                color: #5ACE84;
                margin-top: 3px;
            }
        }

        button {
            width: 100px !important;
            height: 36px !important;
            letter-spacing: 1px !important;
            margin: 0 !important;
            padding: 0;
            text-transform: uppercase;
        }
    }

    i {
        margin-top: 20px;
        display: block;
    }

    .color-red {
        margin-top: 20px;
    }

`

const HardwareDevices = () => {

    const [disabling, setDisabling] = useState(false);
    const [confirmDisable, setConfirmDisable] = useState(false);
    const dispatch = useDispatch();
    const account = useSelector(({ account }) => account);
    const recoveryMethods = useRecoveryMethods(account.accountId);
    const keys = account.fullAccessKeys || [];
    const recoveryKeys = recoveryMethods.filter(method => method.kind !== 'ledger').map(key => key.publicKey)
    const publicKeys = keys.map(key => key.public_key)
    const hasOtherMethods = publicKeys.some(key => recoveryKeys.includes(key))
    const hasLedger = recoveryMethods.filter(method => method.kind === 'ledger').map(key => key.publicKey).some(key => publicKeys.includes(key))
    const ledgerIsConnected = account.ledgerKey !== null;
    const hasLedgerButNotConnected = hasLedger && !ledgerIsConnected

    const handleConfirmDisable = async () => {
        try {
            setDisabling(true)
            await dispatch(disableLedger());
        } finally {
            await dispatch(getAccessKeys())
            await dispatch(getLedgerKey())
            setDisabling(false)
            setConfirmDisable(false);
        }
    }

    const handleConnectLedger = async () => {
        await dispatch(addLedgerAccessKey())
        await dispatch(getLedgerKey())
    }

    const getActionButton = () => {
        if (ledgerIsConnected) {
            return <FormButton disabled={!hasOtherMethods} color='gray-red' onClick={() => setConfirmDisable(true)}><Translate id='button.disable'/></FormButton>
        } else if (hasLedgerButNotConnected) {
            return <FormButton color='blue' onClick={handleConnectLedger}><Translate id='button.connect'/></FormButton>
        } else {
            return <FormButton linkTo={`/setup-ledger/${account.accountId}`} color='blue'><Translate id='button.enable'/></FormButton> 
        }
    }
    
    return (
        <Container>
            <div className='header'>
                <HardwareDeviceIcon/>
                <h2><Translate id='hardwareDevices.title'/></h2>
            </div>
            {!confirmDisable ?
                <>
                    <div className='font-rounded'><Translate id='hardwareDevices.desc'/></div>
                    <div className='device'>
                        <div className='name'>
                            <Translate id='hardwareDevices.ledger.title'/>
                            {ledgerIsConnected && <div><Translate id='hardwareDevices.ledger.auth'/></div>}
                        </div>
                        {getActionButton()}
                    </div>
                </>
                :
                <ConfirmDisable 
                    onConfirmDisable={handleConfirmDisable} 
                    onKeepEnabled={() => setConfirmDisable(false)}
                    accountId={account.accountId}
                    disabling={disabling}
                    component='hardwareDevices'
                />
            }
            {!hasOtherMethods && ledgerIsConnected && 
                <i><Translate id='hardwareDevices.ledger.disclaimer'/></i>
            }
            {hasLedgerButNotConnected &&
                <div className='color-red'><Translate id='hardwareDevices.ledger.connect'/></div>
            }
        </Container>
    )
}


export default withRouter(HardwareDevices);
