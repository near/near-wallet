import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import {
    recoverAccountSecretKey,
    refreshAccount,
    redirectTo,
    clearAccountState
} from '../../../actions/account';
import { Mixpanel } from '../../../mixpanel/index';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';

const StyledContainer = styled(Container)`
    &&& {
        h1 {
            margin-top: 50px;
            text-align: center;
        }
    
        button {
            margin: 40px auto 0 auto;
            display: block;
            width: 100%;
        }
    }
`;

export function AutoImportWithSecretKey() {
    const dispatch = useDispatch();
    const { location } = useSelector(({ router }) => router);
    const [recovering, setRecovering] = useState(false);
    const string = decodeURI(window.location.hash.substring(1));
    const hasAccountId = string.includes('/');
    const accountId = hasAccountId ? string.split('/')[0] : null;
    const secretKey = hasAccountId ? string.split('/')[1] : string;
    const successUrl = location.query.success_url;
    const failureUrl = location.query.failure_url;
    
    useEffect(() => {
        recoverWithSecretKey();
    }, []);

    const recoverWithSecretKey = async () => {
        await Mixpanel.withTracking("IE-SP Recovery with secret key auto",
            async () => {
                setRecovering(true);
                await dispatch(recoverAccountSecretKey(secretKey, accountId));
                await dispatch(refreshAccount());
                dispatch(clearAccountState());

                if (successUrl) {
                    window.location.href = successUrl;
                    return;
                }
                
                await dispatch(redirectTo('/'));
            },
            (e) => {
                setRecovering('failed');
                console.error(e);
            }
        );
    };

    return (
        <StyledContainer className='small-centered'>
            {recovering === true &&
                <h1 className='animated-dots'>
                    <Translate
                        id={`importAccount.${accountId ? 'withId' : 'noId'}`}
                        data={{ accountId: accountId }}
                    />
                </h1>
            }
            {recovering === 'failed' &&
                <>
                    <h1>
                        <Translate
                            id={`importAccount.${accountId ? 'withIdFailed' : 'noIdFailed'}`}
                            data={{ accountId: accountId }}
                        />
                    </h1>
                    <FormButton onClick={recoverWithSecretKey}><Translate id='button.tryAgain'/></FormButton>
                    {failureUrl ? 
                        <FormButton color='gray-blue' onClick={() => window.location.href = failureUrl}><Translate id='button.cancel'/></FormButton>
                        :
                        <FormButton color='gray-blue' linkTo='/create'><Translate id='button.createNewAccount'/></FormButton>
                    }
                </>
            }
        </StyledContainer>
    );
}
