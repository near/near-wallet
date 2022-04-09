import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Mixpanel } from '../../../mixpanel/index';
import { resendTwoFactor, get2faMethod, getMultisigRequest } from '../../../redux/actions/account';
import { selectAccountSlice, selectAccountMultisigRequest } from '../../../redux/slices/account';
import { selectActionsPending, selectStatusSlice } from '../../../redux/slices/status';
import getTranslationsFromMultisigRequest from '../../../utils/getTranslationsFromMultisigRequest';
import { WalletError } from '../../../utils/walletError';
import AlertBanner from '../../common/AlertBanner';
import FormButton from '../../common/FormButton';
import Modal from '../../common/modal/Modal';
import ModalTheme from '../ledger/ModalTheme';
import TwoFactorVerifyInput from './TwoFactorVerifyInput';

const TOO_MANY_REQUESTS_STATUS = 429;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const StyledBannerContainer = styled.div`
    &&& {
        div:first-child {
            margin: 0px;
            width: 100%;
            word-break: break-word;
            @media (max-width: 450px) {
                 border-radius: 4px;
            }
        }

        pre {
            margin: 0px;
        }
    }
`;

const ActionDetailsBanner = ({ multisigRequest }) => {
    const isAddingFullAccessKey = multisigRequest.actions.some(({ type, permission }) => type === 'AddKey' && !permission);

    return  (
        <StyledBannerContainer>
            <AlertBanner theme={isAddingFullAccessKey ? 'warning' : 'light-blue'}>
                {getTranslationsFromMultisigRequest(multisigRequest).map(({ id, data }, index, arr) => (
                    <React.Fragment key={JSON.stringify(data)}>
                        <Translate id={id} data={data} />
                        {index !== arr.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </AlertBanner>
        </StyledBannerContainer>
    );
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
            async () => {
                await dispatch(resendTwoFactor());
                setResendCode('resent');
                setTimeout(() => { setResendCode(); }, 3000);
            },
            (e) => {
                if (e.status === TOO_MANY_REQUESTS_STATUS) {
                    onClose(false, e);
                } else {
                    setResendCode();
                }

                throw e;
            },
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
            {multisigRequest && <ActionDetailsBanner multisigRequest={multisigRequest} />}
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
