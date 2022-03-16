import { KeyPair } from 'near-api-js';
import { generateSeedPhrase } from 'near-seed-phrase';
import React, { useEffect, useState } from 'react';

import { Mixpanel } from '../../../../mixpanel/index';
import ConfirmPassphrase from './ConfirmPassphrase';
import SavePassphrase from './SavePassphrase';

// TODO: Make this custom hook to re-use with future SetupPassphraseExistingAccount component

export default ({ handleConfirmPassphrase }) => {
    const [passPhrase, setPassPhrase] = useState('');
    const [recoveryKeyPair, setRecoveryKeyPair] = useState();
    const [implicitAccountId, setImplicitAccountId] = useState('');

    const [confirmPassphrase, setConfirmPassphrase] = useState(false);
    const [wordIndex, setWordIndex] = useState(null);
    const [userInputValue, setUserInputValue] = useState('');
    const [userInputValueWrongWord, setUserInputValueWrongWord] = useState(false);

    const generateAndSetPhrase = () => {
        const { seedPhrase, secretKey } = generateSeedPhrase();
        const recoveryKeyPair = KeyPair.fromString(secretKey);
        const implicitAccountId = Buffer.from(recoveryKeyPair.publicKey.data).toString('hex');

        setPassPhrase(seedPhrase);
        setRecoveryKeyPair(recoveryKeyPair);
        setImplicitAccountId(implicitAccountId);
        setWordIndex(Math.floor(Math.random() * 12));
    };

    useEffect(() => {
        generateAndSetPhrase();
    }, []);

    if (confirmPassphrase) {
        return (
            <ConfirmPassphrase
                wordIndex={wordIndex}
                userInputValue={userInputValue}
                userInputValueWrongWord={userInputValueWrongWord}
                handleChangeWord={(userInputValue) => {
                    if (userInputValue.match(/[^a-zA-Z]/)) {
                        return false;
                    }
                    setUserInputValue(userInputValue.trim().toLowerCase());
                    setUserInputValueWrongWord(false);
                }}
                handleStartOver={() => {
                    generateAndSetPhrase();
                    setConfirmPassphrase(false);
                    setUserInputValue('');
                }}
                handleConfirmPassphrase={async () => {
                    Mixpanel.track('SR-SP Verify start');
                    if (userInputValue !== passPhrase.split(' ')[wordIndex]) {
                        setUserInputValueWrongWord(true);
                        return;
                    }
                    handleConfirmPassphrase({ implicitAccountId, recoveryKeyPair });
                    Mixpanel.track('SR-SP Verify finish');
                }}
                passPhrase={passPhrase}
            />
        );
    }

    return (
        <SavePassphrase
            passPhrase={passPhrase}
            refreshPhrase={() => {
                generateAndSetPhrase();
            }}
            onClickContinue={() => {
                setConfirmPassphrase(true);
            }}
        />
    );
};
