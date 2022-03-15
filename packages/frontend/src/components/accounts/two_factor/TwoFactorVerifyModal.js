import BN from 'bn.js';
import { utils } from 'near-api-js';
import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Mixpanel } from '../../../mixpanel/index';
import { resendTwoFactor, get2faMethod, getMultisigRequest } from '../../../redux/actions/account';
import { selectAccountSlice, selectAccountMultisigRequest } from '../../../redux/slices/account';
import { selectActionsPending, selectStatusSlice } from '../../../redux/slices/status';
import { WalletError } from '../../../utils/walletError';
import AlertBanner from '../../common/AlertBanner';
import FormButton from '../../common/FormButton';
import Modal from '../../common/modal/Modal';
import ModalTheme from '../ledger/ModalTheme';
import TwoFactorVerifyInput from './TwoFactorVerifyInput';

const {
    format: {
        formatNearAmount
    },
    key_pair: {
        PublicKey,
        KeyType
    },
} = utils;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const formatNear = (amount) => {
    try {
        return formatNearAmount(amount, 4);
    } catch {
        // Near amount may be stored as hex rather than decimal
        return formatNearAmount(new BN(amount, 16).toString(), 4);
    }
};

const getTranslationsFromMultisigRequest = ({ actions, receiverId, accountId }) => {
    const fullAccessKeyAction = actions.find(({ enum: type, permission }) => type === 'addKey' && !permission);
    if (fullAccessKeyAction) {
        const publicKey = new PublicKey({
            keyType: KeyType.ED25519,
            data: fullAccessKeyAction.addKey.publicKey.data
        });
        return [
            {
                id: 'twoFactor.action.addKey.full',
                data: {
                    accountId,
                    publicKey: publicKey.toString(),
                }
            }
        ];
    }

    return actions
        .map(({ enum: actionType, [actionType]: action }) => {
            switch (actionType) {
                case 'addKey':
                    return {
                        id: 'twoFactor.action.addKey.limited',
                        data: {
                            receiverId,
                            methodNames: action.permission.functionCall.methodNames.join(', '),
                            allowance: formatNearAmount(action.permission.functionCall.allowance, 4),
                            publicKey: new PublicKey({ keyType: KeyType.ED25519, data: action.publicKey.data }).toString(),
                        }
                    };
                case 'deleteKey':
                    return {
                        id: 'twoFactor.action.deleteKey',
                        data: {
                            publicKey: new PublicKey({ keyType: KeyType.ED25519, data: action.publicKey.data }).toString(),
                        }
                    };
                case 'functionCall':
                    return {
                        id: 'twoFactor.action.functionCall',
                        data: {
                            receiverId,
                            methodName: action.methodName,
                            deposit: formatNear(action.deposit, 4),
                            args: Buffer.from(action.args).toString(),
                        }
                    };
                case 'transfer':
                    return {
                        id: 'twoFactor.action.transfer',
                        data:{
                            receiverId,
                            deposit: formatNearAmount(action.deposit, 4),
                        }
                    };
                case 'stake':
                    return {
                        id: 'twoFactor.action.stake',
                        data: {
                            receiverId,
                            deposit: formatNearAmount(action.deposit, 4),
                        }
                    };
                default:
                    return {};
            }
        });
};

const TwoFactorVerifyModal = ({ open, onClose }) => {

    const [method, setMethod] = useState();
    const [code, setCode] = useState('');
    const [resendCode, setResendCode] = useState();
    const dispatch = useDispatch();
    const account = useSelector(selectAccountSlice);
    const multisigRequest = useSelector(selectAccountMultisigRequest);
    const status = useSelector(selectStatusSlice);
    const loading = useSelector((state) => selectActionsPending(state, { types: ['VERIFY_TWO_FACTOR'] }));

    useEffect(() => {
        let isMounted = true;

        const handleGetTwoFactor = async () => {
            setMethod(await dispatch(get2faMethod()));
        };

        if (isMounted) {
            handleGetTwoFactor();
            dispatch(getMultisigRequest());
        }
        
        return () => { isMounted = false; };
    }, []);

    const handleVerifyCode = async () => {
        if (code.length === 6 && !loading) {
            onClose(code);
        }
    };

    const handleChange = (code) => {
        setCode(code);
    };

    const handleResendCode = async () => {
        setResendCode('resending');
        await Mixpanel.withTracking('2FA Modal Resend code', 
            async () => await dispatch(resendTwoFactor()),
            (e) => {
                setResendCode();
                throw e;
            },
            () => {
                setResendCode('resent');
                setTimeout(() => { setResendCode(); }, 3000);
            }
        );
    };
    
    const handleCancelClose = () => {
        Mixpanel.track('2FA Modal Cancel verification');
        onClose(false, new WalletError('Request was cancelled.', 'promptTwoFactor.userCancelled'));
    };
    
    return (
        <Modal
            id='two-factor-verify-modal'
            isOpen={open}
            onClose={handleCancelClose}
            closeButton='desktop'
        >
            <ModalTheme/>
            <h2 className='title'><Translate id='twoFactor.verify.title'/></h2>
            <p className='font-bw'><Translate id='twoFactor.verify.desc'/></p>
            <p className='color-black font-bw' style={{ marginTop: '-10px', fontWeight: '500', height: '19px'}}>{method && method.detail}</p>
            {multisigRequest && (
                <AlertBanner theme="alert">
                    {getTranslationsFromMultisigRequest(multisigRequest).map(({ id, data }) => (
                        <>
                            <Translate id={id} data={data} />
                            <br />
                        </>
                    ))}
                </AlertBanner>
            )}
            <Form onSubmit={(e) => {handleVerifyCode(); e.preventDefault();}}>
                <TwoFactorVerifyInput
                    code={code}
                    onChange={handleChange}
                    onResend={handleResendCode}
                    account={account}
                    status={status}
                    resendCode={resendCode}
                />
                <FormButton type='submit' disabled={code.length !== 6 || loading} sending={loading}>
                    <Translate id='button.verifyCode'/>
                </FormButton>
            </Form>
            <button onClick={handleCancelClose} className='link color-red'><Translate id='button.cancel'/></button>
        </Modal>
    );
};

export default TwoFactorVerifyModal;
