import { generateSeedPhrase } from 'near-seed-phrase';
import React, { useEffect, useState } from 'react';

import ConfirmPassphrase from './ConfirmPassphrase';
import SavePassphrase from './SavePassphrase';

export default () => {
    const [passPhrase, setPassPhrase] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [publicKey, setPublicKey] = useState('');

    const [confirmPassphrase, setConfirmPassphrase] = useState(false);
    const [wordId, setWordId] = useState(null);
    const [userInputValue, setUserInputValue] = useState('');


    const generateAndSetPhrase = () => {
        const { seedPhrase, secretKey, publicKey } = generateSeedPhrase();
        setPassPhrase(seedPhrase);
        setSecretKey(secretKey);
        setPublicKey(publicKey);
        setWordId(Math.floor(Math.random() * 12));
    };

    useEffect(() => {
        generateAndSetPhrase();
    }, []);

    console.log('wordId', wordId);
    console.log('userInputValue',userInputValue);

    if (confirmPassphrase) {
        return (
            <ConfirmPassphrase
                wordId={wordId}
                userInputValue={userInputValue}
                handleChangeWord={(userInputValue) => setUserInputValue(userInputValue)}
                handleStartOver={() => {
                    generateAndSetPhrase();
                    setConfirmPassphrase(false);
                }}
                handleConfirmPassphrase={() => {
                    console.log('confirm phrase');
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