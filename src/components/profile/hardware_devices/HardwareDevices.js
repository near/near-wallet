import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../../common/styled/Card.css';
import FormButton from '../../common/FormButton';
import HardwareDeviceIcon from '../../svg/HardwareDeviceIcon';
import { 
    loadRecoveryMethods, 
    getAccessKeys,
    removeAccessKey
} from '../../../actions/account';

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
    }

    .device {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 2px solid #f8f8f8;
        margin: 20px -20px 0 -20px;
        padding: 20px 20px 0 20px;

        .name {
            font-weight: 600;
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

const HardwareDevices = ({ 
    account,
    loadRecoveryMethods, 
    recoveryMethods,
    getAccessKeys,
    removeAccessKey
}) => {
    const [removing, setRemoving] = useState(false);
    const keys = account.fullAccessKeys;
    const hasLedger = keys && keys.find(key => key.meta.type === 'ledger');
    const hasOtherMethods = recoveryMethods && recoveryMethods.some(method => method.confirmed);

    useEffect(() => { 
        getAccessKeys()
        loadRecoveryMethods()
    }, []);

    const disableLedger = () => {
        setRemoving(true);
        removeAccessKey(hasLedger.public_key).then(() => {
            getAccessKeys().then(() => {
                setRemoving(false);
            })
        })
    }

    return (
        <Container>
            <div className='header'>
                <HardwareDeviceIcon/>
                <h2>Hardware Devices</h2>
            </div>
            <div className='font-rounded'>
                Improve the security of your account by entrusting your keys to a hardware wallet.
            </div>
            <div className='device'>
                <div className='name'>
                    Ledger Hardware Wallet
                    {hasLedger && <div>Authorized</div>}
                </div>
                {!hasLedger && <FormButton linkTo='/setup-ledger' color='blue'>Enable</FormButton>}
                {hasLedger && <FormButton disabled={!hasOtherMethods || removing} color='gray-red' onClick={disableLedger} sending={removing}>Disable</FormButton>}
            </div>
            {!hasOtherMethods && <i>In order to disable your ledger device, you must first enable an alternative recovery method.</i>}
        </Container>
    )
}

const mapDispatchToProps = {
    loadRecoveryMethods,
    getAccessKeys,
    removeAccessKey,
}

const mapStateToProps = ({ account, recoveryMethods }) => ({
    account,
    recoveryMethods: recoveryMethods[account.accountId]
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HardwareDevices));