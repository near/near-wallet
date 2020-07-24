import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../../common/styled/Card.css';
import FormButton from '../../common/FormButton';
import HardwareDeviceIcon from '../../svg/HardwareDeviceIcon';
import { 
    getAccessKeys,
    disableLedger,
    getLedgerKey
} from '../../../actions/account';
import { useRecoveryMethods } from '../../../hooks/recoveryMethods';
import ConfirmDisable from './ConfirmDisable';
import { Translate } from 'react-localize-redux';

const Container = styled(Card)`
    margin-top: 30px;

    .header {
        display: flex;
        align-items: center;

        h2 {
            line-height: normal;
        }

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
            height: 40px !important;
            letter-spacing: 0.5px !important;
            margin: 0 !important;
            padding: 0;
            text-transform: uppercase;
        }
    }

    i {
        margin-top: 20px;
        display: block;
    }
`

const HardwareDevices = () => {

    const [disabling, setDisabling] = useState(false);
    const [confirmDisable, setConfirmDisable] = useState(false);
    const dispatch = useDispatch();
    const account = useSelector(({ account }) => account);
    const recoveryMethods = useRecoveryMethods(account.accountId);
    const keys = account.fullAccessKeys || [];
    const recoveryKeys = recoveryMethods.map(key => key.publicKey)
    const publicKeys = keys.map(key => key.public_key)
    const hasOtherMethods = publicKeys.some(key => recoveryKeys.includes(key))
    const hasLedger = account.ledgerKey !== null;

    useEffect(() => { 
        dispatch(getAccessKeys())
    }, []);

    const handleConfirmDisable = async () => {
        try {
            setDisabling(true)
            await dispatch(disableLedger());
        } catch(e) {
            console.log(e)
            return;
        } finally {
            await dispatch(getAccessKeys())
            await dispatch(getLedgerKey())
            setDisabling(false)
            setConfirmDisable(false);
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
                            {hasLedger && <div><Translate id='hardwareDevices.ledger.auth'/></div>}
                        </div>
                        {!hasLedger ? 
                            <FormButton linkTo={`/setup-ledger/${account.accountId}`} color='blue'><Translate id='button.enable'/></FormButton> 
                            : 
                            <FormButton disabled={!hasOtherMethods} color='gray-red' onClick={() => setConfirmDisable(true)}><Translate id='button.disable'/></FormButton>
                        }
                    </div>
                </>
                :
                <ConfirmDisable 
                    onConfirmDisable={handleConfirmDisable} 
                    onKeepEnabled={() => setConfirmDisable(false)}
                    accountId={account.accountId}
                    disabling={disabling}
                />
            }
            {!hasOtherMethods && hasLedger && 
                <i><Translate id='hardwareDevices.ledger.disclaimer'/></i>
            }
        </Container>
    )
}


export default withRouter(HardwareDevices);