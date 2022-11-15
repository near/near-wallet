import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import IconSecurityLock from '../../../../images/wallet-migration/IconSecurityLock';
import { showCustomAlert } from '../../../../redux/actions/status';
import { TwoFactor } from '../../../../utils/twoFactor';
import { ButtonsContainer, StyledButton, MigrationModal } from '../../CommonComponents';

const Container = styled.div`
    padding: 15px 0;
    text-align: center;
    margin: 0 auto;

    @media (max-width: 360px) {
        padding: 0;
    }

    @media (min-width: 500px) {
        padding: 48px 28px 12px;
    }

    .accountsTitle {
        text-align: left;
        font-size: 12px;
        padding-top: 72px;
        padding-bottom: 6px;
    }

    .title{
        font-weight: 800;
        font-size: 20px;
        margin-top: 40px;
    }
`;

const Textarea = styled.textarea`
    resize: none;
    margin-top: 50px;
    height: 130px;
`;


const AccountLockModal = ({ accountId, onClose, onComplete, onCancel }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [passphrase, setPassphrase] = useState('');
    const [isLoading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const onContinue = () => setIsContinue(true);
    const onBack = () => setIsContinue(false);

    const onModalCancel = () => {
        onCancel();
        onClose();
    };
    
    const onSetPassphrase = (e) => setPassphrase(e.target.value);

    const onButtonClick = () => {
        setLoading(true);
        TwoFactor.disableMultisigWithFAK({ accountId, seedPhrase: passphrase.trim(), cleanupState: false })
            .then(() => {
                setLoading(false);
                onComplete();
                onClose();
            }).catch((e) => {
                setLoading(false);
                let err;
                if (e.message.includes('did not match a signature of')) {
                    err = 'The passphrase you entered does not match this account. Please try again with another key.';
                }

                if (err) {
                    dispatch(showCustomAlert({
                        errorMessage: err,
                        success: false,
                        messageCodeHeader: 'error'
                    }));
                }
                
                throw new Error(e.message);
            });
    };

    return (
        <MigrationModal>
            <Container>
                {
                    !isContinue ? (
                    <>
                            <IconSecurityLock />
                            <h4 className='title'><Translate id='twoFactorDisableLocked.title' /></h4>
                            <p><Translate id='twoFactorDisableLocked.descOne' /><b>{accountId}</b></p>
                            <p><Translate id='twoFactorDisableLocked.descTwo' /></p>
                            <ButtonsContainer>
                                <StyledButton className="gray-blue" onClick={onModalCancel}>
                                    <Translate id='button.cancel' />
                                </StyledButton>
                                <StyledButton onClick={onContinue}>
                                    <Translate id={'button.continue'} />
                                </StyledButton>
                            </ButtonsContainer>
                        </>
                    ) : (
                        <>
                            <h4 className='title'><Translate id='twoFactorRemoveAuth.title' /></h4>
                            <p><Translate id='twoFactorRemoveAuth.desc' /></p>
                            <h4>{accountId}</h4>
                            <Textarea value={passphrase} onChange={onSetPassphrase} disabled={isLoading} />
                            <ButtonsContainer vertical>
                                <StyledButton
                                    className="blue"
                                    onClick={onButtonClick}
                                    disabled={!passphrase}
                                    sending={isLoading}
                                    sendingString='twoFactorRemoveAuth.button'
                                    fullWidth
                                >
                                    <Translate id='twoFactorRemoveAuth.button' />
                                </StyledButton>
                                <StyledButton className="white-blue" onClick={onBack} fullWidth>
                                    <Translate id='button.cancel' />
                                </StyledButton>
                            </ButtonsContainer>
                        </>
                    )
                }
            </Container>
        </MigrationModal>
    );
};

export default AccountLockModal;
