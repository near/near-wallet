import React, { useCallback, useState } from 'react';
import { Redirect } from 'react-router-dom';

import {
    createKeyFrom,
    HAS_ENCRYPTION, isKeyValid,
} from '../../utils/keyEncryption';
import {KEY_ACTIVE_ACCOUNT_ID} from '../../utils/wallet';

// todo выглядит так, что rpc запросов вообще быть не должно если попали на эту страницу,
// как если бы попали на /
const EnterPassword = () => {
    const [value, setValue] = useState('');
    const handleChange = useCallback((evt) => {
        setValue(evt.currentTarget.value);
    }, []);

    const handleSubmit = useCallback(() => {
        const accountId = localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID) || '';
        isKeyValid(createKeyFrom(value), accountId);
    }, [value]);

    const handleSet = useCallback(() => {
        const key = createKeyFrom(value);
    }, [value]);

    if (!HAS_ENCRYPTION) {
        return (
            <Redirect
                to={{
                    pathname: '/',
                }}
            />
        );
    }

    return (
        <div>
            <input onChange={handleChange} value={value}/>
            <button onClick={handleSubmit}>ok</button>
            <button onClick={handleSet}>set</button>
        </div>
    );
};

export default EnterPassword;
