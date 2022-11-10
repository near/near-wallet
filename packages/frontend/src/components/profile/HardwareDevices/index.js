import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Mixpanel } from '../../../mixpanel/index';
import {
    getAccessKeys,
    disableLedger,
    getLedgerKey,
    addLedgerAccessKey
} from '../../../redux/actions/account';
import {
    selectAccountFullAccessKeys,
    selectAccountSlice
} from '../../../redux/slices/account';
import {
    actions as recoveryMethodsActions,
    selectRecoveryMethodsStatus
} from '../../../redux/slices/recoveryMethods';
import FormButton from '../../common/FormButton';
import SkeletonLoading from '../../common/SkeletonLoading';
import ConfirmDisable from '../ConfirmDisable';
import {Authorized, Container, Device, MainTitle, Name} from './ui';
const { fetchRecoveryMethods } = recoveryMethodsActions;

const HardwareDevices = ({
    recoveryMethods,
    hasLedger,
    ledgerIsConnected,
    hasLedgerButNotConnected
}) => {
    const [disabling, setDisabling] = useState(false);
    const [confirmDisable, setConfirmDisable] = useState(false);
    const dispatch = useDispatch();

    const account = useSelector(selectAccountSlice);
    const { accountId } = account;
    let userRecoveryMethods = recoveryMethods || [];
    const recoveryKeys = userRecoveryMethods.filter((method) =>
        method.kind !== 'ledger').map((key) => key.publicKey);

    const keys = useSelector(selectAccountFullAccessKeys);
    const publicKeys = keys.map((key) => key.public_key);
    const hasOtherMethods = publicKeys.some((key) => recoveryKeys.includes(key));

    const loadingStatus = useSelector((state) =>
        selectRecoveryMethodsStatus(state, { accountId }));

    const handleConfirmDisable = async () => {
        await Mixpanel.withTracking('SR-Ledger Handle confirm disable',
            async () => {
                setDisabling(true);
                await dispatch(disableLedger());
            },
            () => { },
            async () => {
                await dispatch(getAccessKeys());
                await dispatch(getLedgerKey());
                await dispatch(fetchRecoveryMethods({
                    accountId
                }));
                setDisabling(false);
                setConfirmDisable(false);
            }
        );
    };

    const handleConnectLedger = async () => {
        await Mixpanel.withTracking('SR-Ledger Reconnect ledger',
            async () => {
                await dispatch(addLedgerAccessKey());
                await dispatch(getLedgerKey());
                await dispatch(fetchRecoveryMethods({
                    accountId
                }));
            }
        );
    };

    const getActionButton = () => {
        if (ledgerIsConnected) {
            return (
                <FormButton
                    disabled={!hasOtherMethods}
                    color='gray-red'
                    onClick={() => setConfirmDisable(true)}>
                    <Translate id='button.disable' />
                </FormButton>
            );
        } else if (hasLedgerButNotConnected) {
            return (
                <FormButton color='blue'
                    onClick={handleConnectLedger}>
                    <Translate id='button.connect' />
                </FormButton>
            );
        } else {
            return (
                <FormButton
                    linkTo={`/setup-ledger/${account.accountId}`}
                    color='blue'
                    trackingId="SR-Ledger Click enable button">
                    <Translate id='button.enable' />
                </FormButton>
            );
        }
    };

    if (!loadingStatus.isInitialized) {
        return (
            <SkeletonLoading
                height='138px'
                show={true}
            />
        );
    }

    return (
        <Container>
            {!confirmDisable ? (
                <>
                    <Device>
                        <MainTitle>
                            <Name>
                                <Translate id='hardwareDevices.ledger.title' />
                            </Name>
                            {getActionButton()}
                        </MainTitle>
                        {ledgerIsConnected && (
                            <Authorized>
                                <Translate id='hardwareDevices.ledger.auth' />
                            </Authorized>
                        )}
                    </Device>
                    {!hasOtherMethods && ledgerIsConnected && (
                        <i>
                            <Translate id='hardwareDevices.ledger.disclaimer' />
                        </i>
                    )}
                    {hasLedgerButNotConnected && (
                        <div className='color-red'>
                            <Translate id='hardwareDevices.ledger.connect' />
                        </div>
                    )}
                    {!hasLedger &&
                        <i><Translate id='hardwareDevices.desc' /></i>
                    }
                </>
            ) : (
                <ConfirmDisable
                    onConfirmDisable={handleConfirmDisable}
                    onKeepEnabled={() => setConfirmDisable(false)}
                    accountId={account.accountId}
                    isDisable={disabling}
                    component='hardwareDevices'
                />
            )}
        </Container>
    );
};

export default withRouter(HardwareDevices);
