import { KeyPair } from 'near-api-js';
import { generateSeedPhrase } from 'near-seed-phrase';
import React, { useEffect, useState } from 'react';

import { Mixpanel } from '../../../../mixpanel/index';
import ConfirmPassphrase from './ConfirmPassphrase';
import SavePassphrase from './SavePassphrase';

// TODO: Make this custom hook to re-use with future SetupPassphraseExistingAccount component

type SetupPassphraseNewAccountProps = {
    handleConfirmPassphrase: (params: { implicitAccountId:string, recoveryKeyPair: string })=> void;
}

export default ({ handleConfirmPassphrase }:SetupPassphraseNewAccountProps) => {
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
        //@ts-ignore
        const implicitAccountId = Buffer.from(recoveryKeyPair.publicKey.data).toString('hex');

        setPassPhrase(seedPhrase);
        //@ts-ignore
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
                    //@ts-ignore
                    Mixpanel.track('SR-SP Verify start');
                    if (userInputValue !== passPhrase.split(' ')[wordIndex]) {
                        setUserInputValueWrongWord(true);
                        return;
                    }
                    handleConfirmPassphrase({ implicitAccountId, recoveryKeyPair });
                    //@ts-ignore
                    Mixpanel.track('SR-SP Verify finish');
                }}
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
