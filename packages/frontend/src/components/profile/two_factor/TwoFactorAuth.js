import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { disableMultisig, disableMultisigWithBatchKeyConversion } from '../../../redux/actions/account';
import { selectAccountSlice } from '../../../redux/slices/account';
import { actions as recoveryMethodsActions } from '../../../redux/slices/recoveryMethods';
import { selectActionsPending } from '../../../redux/slices/status';
import FormButton from '../../common/FormButton';
import Card from '../../common/styled/Card.css';
import AccountLockModal from '../../wallet-migration/modals/Disable2faModal/AccountLock';
import ConfirmDisable from '../hardware_devices/ConfirmDisable';
const { fetchRecoveryMethods } = recoveryMethodsActions;


const Container = styled(Card)`
    margin-top: 30px;

    .title {
        color: #24272a;
        font-weight: 500;
    }

    .detail {
        color: #A1A1A9;
    }

    .method {
        .top {
            display: flex;
            align-items: center;
            justify-content: space-between;

            button {
                height: 36px;
                width: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
            }
        }

        .bottom {
            margin-top: 20px;
            color: #A1A1A9;
        }

        .color-red {
            margin-top: 20px;
        }

    }
`;

const TwoFactorAuth = ({ twoFactor, history, isBrickedAccount, isKeyConversionRequiredFor2faDisable, onDisableBrickedAccountComplete }) => {
    const [confirmDisable, setConfirmDisable] = useState(false);
    const [showBrickedAccountModal, setShowBrickedAccountModal] = useState(false);
    const account = useSelector(selectAccountSlice);
    const dispatch = useDispatch();
    const confirmDisabling = useSelector((state) => selectActionsPending(state, {
        types: ['DISABLE_MULTISIG', 'DISABLE_MULTISIG_WITH_BATCH_KEY_CONVERSION']
    }));

    const handleConfirmDisable = async () => {
        if (isBrickedAccount) {
            setShowBrickedAccountModal(true);
        } else if (isKeyConversionRequiredFor2faDisable) {
            await dispatch(disableMultisigWithBatchKeyConversion());
        } else {
            await dispatch(disableMultisig());
        }
        await dispatch(fetchRecoveryMethods({ accountId: account.accountId }));
        setConfirmDisable(false);
    };

    const onAccountLockClose = () => {
        setShowBrickedAccountModal(false);
    };

    const onAccountLockComplete = () => {
        setShowBrickedAccountModal(false);
        onDisableBrickedAccountComplete();
    };

    const onAccountLockCancel = () => {
        setShowBrickedAccountModal(false);
    };

    return (
        <Container>
            {twoFactor && !confirmDisable && (
                <div className='method'>
                    <div className='top'>
                        <div>
                            <div className='title'>
                                <Translate id={`twoFactor.${twoFactor.kind === '2fa-email' ? 'email' : 'phone'}`} />
                            </div>
                            <div className='detail'>{twoFactor.detail}</div>
                        </div>
                        <FormButton onClick={() => setConfirmDisable(true)} className='gray-red'><Translate id='button.disable' /></FormButton>
                    </div>
                    <div className='bottom'>
                        <span className='color-green'>
                            <Translate id='twoFactor.active' />
                        </span> <Translate id='twoFactor.since' /> {new Date(twoFactor.createdAt).toDateString().replace(/^\S+\s/, '')}
                    </div>
                </div>
            )}
            {twoFactor && confirmDisable && (
                <ConfirmDisable
                    onConfirmDisable={handleConfirmDisable}
                    onKeepEnabled={() => setConfirmDisable(false)}
                    accountId={account.accountId}
                    disabling={confirmDisabling}
                    component='twoFactor'
                    twoFactorKind={twoFactor.kind}
                    isKeyConversionRequiredFor2faDisable={isKeyConversionRequiredFor2faDisable}
                />
            )}
            {twoFactor && isBrickedAccount && showBrickedAccountModal && (
                <AccountLockModal accountId={account.accountId} onClose={onAccountLockClose} onComplete={onAccountLockComplete} onCancel={onAccountLockCancel} />
            )}
        </Container>
    );
};

export default withRouter(TwoFactorAuth);
