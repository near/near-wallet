import { parseSeedPhrase } from 'near-seed-phrase';
import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { ButtonsContainer, StyledButton } from '../../CommonComponents';

const ConfirmKeyDeletionContainer = styled.div`
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

const AccountContainer = styled.p`
    overflow: hidden;
    text-overflow: ellipsis;
`;

const KEY_STATUS = {
    DOES_NOT_EXIST: 'DOES_NOT_EXIST',
    INSECURE_RECOVERY_METHOD: 'INSECURE_RECOVERY_METHOD',
    EMPTY: 'EMPTY',
    PREEXISTING: 'PREEXISTING',
    ROTATED: 'ROTATED',
    TO_BE_DELETED: 'TO_BE_DELETED',
};

const getKeyStatus = ({
    fakPublicKeys,
    publicKeysToDelete,
    rotatedPublicKeys,
    seedPhrase,
}) => {
    if (!seedPhrase || !seedPhrase.trim()) {
        return KEY_STATUS.EMPTY;
    }

    const { publicKey } = parseSeedPhrase(seedPhrase);

    if (rotatedPublicKeys.includes(publicKey)) {
        // key was recently added as part of rotation
        return KEY_STATUS.ROTATED;
    }

    const accessKey = fakPublicKeys.find((fak) => fak.publicKey === publicKey);
    if (!accessKey) {
        // key does not exist on chain for this account
        // NB fakPublicKeys does not contain rotated (or ledger) keys
        return KEY_STATUS.DOES_NOT_EXIST;
    }

    if (accessKey.kind === 'sms' || accessKey.kind === 'email') {
        // seedphrase for this key has been transmitted in plaintext
        return KEY_STATUS.INSECURE_RECOVERY_METHOD;
    }

    if (publicKeysToDelete.includes(publicKey)) {
        // key would be used to sign a transaction deleting itself
        // this is valid but is not ideal as it does not verify the user possesses a FAK seedphrase
        return KEY_STATUS.TO_BE_DELETED;
    }

    // key existed on account prior to migration
    return KEY_STATUS.PREEXISTING;
};

const ConfirmKeyDeletion = ({
    accountId,
    fakPublicKeys,
    isDeleting,
    onClose,
    onNext,
    publicKeysToDelete,
    rotatedPublicKeys,
}) => {
    const [keyStatus, setKeyStatus] = useState(KEY_STATUS.EMPTY);
    const [isDisabled, setIsDisabled] = useState(true);
    const [keyMessage, setKeyMessage] = useState(null);

    useEffect(() => {
        setIsDisabled([
            KEY_STATUS.DOES_NOT_EXIST,
            KEY_STATUS.EMPTY,
            KEY_STATUS.INSECURE_RECOVERY_METHOD,
            KEY_STATUS.TO_BE_DELETED,
        ].includes(keyStatus));

        setKeyMessage({
            [KEY_STATUS.DOES_NOT_EXIST]: 'doesNotExist',
            [KEY_STATUS.INSECURE_RECOVERY_METHOD]: 'insecureRecoveryMethod',
            [KEY_STATUS.TO_BE_DELETED]: 'toBeDeleted',
        }[keyStatus] || null);
    }, [keyStatus]);

    return  (
        <ConfirmKeyDeletionContainer>
            <h4 className='title'>
                <Translate id='walletMigration.cleanKeys.verifyPassphrase.title' />
            </h4>
            <AccountContainer>
                <Translate id='walletMigration.cleanKeys.verifyPassphrase.desc' data={{ accountId }} />
            </AccountContainer>
            {keyMessage && (
                <p className='key-error'>
                    <Translate
                        id={`walletMigration.cleanKeys.verifyPassphrase.keyMessages.${keyMessage}`}
                        data={{ accountId }}
                    />
                </p>
            )}
            <textarea
                onChange={({ target: { value: seedPhrase } }) => setKeyStatus(
                    getKeyStatus({
                        fakPublicKeys,
                        publicKeysToDelete,
                        rotatedPublicKeys,
                        seedPhrase,
                    })
                )}
            />
            <ButtonsContainer vertical>
                <StyledButton
                    onClick={onNext}
                    fullWidth
                    disabled={isDisabled || isDeleting}
                    data-test-id="cleanupKeys.continue"
                >
                    <Translate id='walletMigration.cleanKeys.removeKeys' />
                </StyledButton>
                <StyledButton
                    className='gray-blue'
                    onClick={onClose}
                    fullWidth
                >
                    <Translate id='button.cancel' />
                </StyledButton>
            </ButtonsContainer>
        </ConfirmKeyDeletionContainer>
    );
};

export default ConfirmKeyDeletion;
