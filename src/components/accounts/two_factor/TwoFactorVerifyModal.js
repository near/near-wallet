import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Modal from "../../common/modal/Modal";
import ModalTheme from '../ledger/ModalTheme';
import MobileActionSheet from '../../common/modal/MobileActionSheet';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import TwoFactorVerifyInput from './TwoFactorVerifyInput';
import { verifyTwoFactor, clearAlert } from '../../../actions/account';
import { wallet } from '../../../utils/wallet';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`

const TwoFactorVerifyModal = ({ open, onClose }) => {

    const [method, setMethod] = useState();
    const [code, setCode] = useState('');
    const dispatch = useDispatch();
    const account = useSelector(({ account }) => account);
    const loading = account.actionsPending.includes('VERIFY_TWO_FACTOR');
    const error = account.globalAlert && account.globalAlert.messageCode === 'account.verifyTwoFactor.error';
    console.log(account)

    useEffect(() => {
        let isMounted = true;

        const handleGetTwoFactor = async () => {
            setMethod(await wallet.get2faMethod())
        };

        if (isMounted) {
            handleGetTwoFactor()
        }
        
        return () => { isMounted = false }
    }, []);

    const handleVerifyCode = async () => {
        const { error } = await dispatch(verifyTwoFactor(null, code))

        if (!error && onClose) {
            onClose(true)
        }
    }

    const handleResend = async () => {
        console.log('resend')
        // TODO
    }

    const handleChange = (code) => {
        setCode(code);

        if (account.globalAlert) {
            dispatch(clearAlert())
        }
    }
    
    return (
        <Modal
            id='two-factor-verify-modal'
            isOpen={open}
            onClose={() => onClose(false)}
            closeButton='desktop'
        >
            <ModalTheme/>
            <MobileActionSheet/>
            <h2><Translate id='twoFactor.verify.title'/></h2>
            <p className='font-bw'><Translate id='twoFactor.verify.desc'/></p>
            <p className='color-black font-bw' style={{ marginTop: '-10px', fontWeight: '500' }}>{method && method.detail}</p>
            <Form onSubmit={e => {handleVerifyCode(); e.preventDefault();}}>
                <TwoFactorVerifyInput
                    code={code}
                    onChange={handleChange}
                    onResend={handleResend}
                    error={error}
                />
                <FormButton type='submit' disabled={code.length !== 6 || loading || error} sending={loading}>
                    <Translate id='button.verifyCode'/>
                </FormButton>
                <button className='link color-red' id='close-button'><Translate id='button.cancel'/></button>
            </Form>
        </Modal>
    );
}

export default TwoFactorVerifyModal;