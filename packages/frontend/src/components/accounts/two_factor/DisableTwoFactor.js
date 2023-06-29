import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import DisableTwoFactorForm from './DisableTwoFactorForm';
import { redirectToApp } from '../../../redux/actions/account';
import { showCustomAlert } from '../../../redux/actions/status';
import {selectAccountId} from '../../../redux/slices/account';
import isValidSeedPhrase from '../../../utils/isValidSeedPhrase';
import { TwoFactor } from '../../../utils/twoFactor';
import Container from '../../common/styled/Container.css';

const StyledContainer = styled(Container)`
    .input {
        width: 100%;
    }

    .input-sub-label {
        margin-bottom: 30px;
    }

    button {
        width: 100% !important;
        margin-top: 30px !important;
    }
`;

export function DisableTwoFactor() {
    const dispatch = useDispatch();
    const accountId = useSelector(selectAccountId);
    const [seedPhrase, setSeedPhrase] = useState('');
    const [disablingTwoFactor, setDisablingTwoFactor] = useState(false);

    const handleChange = (value) => {
        setSeedPhrase(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            isValidSeedPhrase(seedPhrase);
            setDisablingTwoFactor(true);

            await TwoFactor.disableMultisigWithFAK(
                {
                    accountId,
                    seedPhrase: seedPhrase.trim(),
                    cleanupState: true
                }
            );

            dispatch(showCustomAlert({
                success: true,
                messageCodeHeader: 'success',
                messageCode: 'success',
            }));

            await dispatch(redirectToApp('/profile'));
        } catch (err) {
            console.error(err);
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                errorMessage: err.message
            }));

            setDisablingTwoFactor(false);
        }
    };

    return (
        <StyledContainer className='small-centered border'>
            <h1>Disable Two-Factor Authentication</h1>
            <h2>Enter passphrase to disable your 2FA </h2>
            <form onSubmit={handleSubmit} autoComplete='off'>
                <DisableTwoFactorForm
                    isLegit={!!seedPhrase.length}
                    disablingTwoFactor={disablingTwoFactor}
                    handleChange = {handleChange}
                />
            </form>
        </StyledContainer>
    );
}
