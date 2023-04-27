import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { showCustomAlert } from '../../redux/actions/status';
import isValidSeedPhrase from '../../utils/isValidSeedPhrase';
import Container from '../common/styled/Container.css';
import Disable2FactoryAuthenticateForm from './disable-2fa-form';
import { disable2faTest } from './disable-2fa-script';

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

export function Disable2faPage() {

    const dispatch = useDispatch();
    // const selector = useSelector()

    const [seedPhrase, setSeedPhrase] = useState('');
    console.log('%cseedPhrase', 'color: aqua;font-size: 12px;', seedPhrase);
    
    const handleChange = (value) => {
        setSeedPhrase(value);
       
    };


    const handleSubmit = async () => {  

        try {
        // DISABLE FOR TESTING 
            isValidSeedPhrase(seedPhrase);

            await disable2faTest(
                // eslint-disable-next-line
                accountId, 
                seedPhrase,
                'heLpUrl',
                'cleanupState' 
            );

            dispatch(showCustomAlert({
                success: true,
                messageCodeHeader: 'success',
                messageCode: 'twoFactor.disable2fa.success',
            }));
        } catch (err) {
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                errorMessage: err.message
            }));      
        }
    };

    return (
        <StyledContainer className='small-centered border'>

            <h1>Disable Two-Factor Authentication</h1>
            <h2>Enter passphrase to disable your 2FA </h2>
            <form onSubmit={(e) => {
                handleSubmit();
                e.preventDefault();
            }} autoComplete='off'>
                <Disable2FactoryAuthenticateForm
                    handleChange = {handleChange}
                />
            </form>
        </StyledContainer>
    );
}
