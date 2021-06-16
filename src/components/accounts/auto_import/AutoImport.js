import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Container from '../../common/styled/Container.css';
import { Translate } from 'react-localize-redux';
import { recoverAccountSeedPhrase, refreshAccount, redirectTo } from '../../../actions/account';
import { Mixpanel } from '../../../mixpanel/index';
import FormButton from '../../common/FormButton';

const StyledContainer = styled(Container)`
    h1 {
        margin-top: 50px;
    }

    button {
        margin: 40px auto 0 auto !important;
        display: block !important;
        width: 100% !important;
    }
`

export function AutoImport() {
    const dispatch = useDispatch();
    const [recovering, setRecovering] = useState(false);
    const string = decodeURI(window.location.hash.substring(1));
    const hasAccountId = string.includes('/');
    const accountId = hasAccountId ? string.split('/')[0] : null;
    const seedPhrase = hasAccountId ? string.split('/')[1] : string;
    
    useEffect(() => {
        recoverWithSeedPhrase()
    }, []);

    const recoverWithSeedPhrase = async () => {
        await Mixpanel.withTracking("IE-SP Recovery with seed phrase auto",
            async () => {
                setRecovering(true)
                await dispatch(recoverAccountSeedPhrase(seedPhrase, accountId))
                await dispatch(refreshAccount())
                await dispatch(redirectTo('/'))
            },
            () => {
                setRecovering('failed')
            }
        )
    }

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
                    <FormButton onClick={recoverWithSeedPhrase}><Translate id='button.tryAgain'/></FormButton>
                    <FormButton color='gray-blue' linkTo='/create'><Translate id='button.createNewAccount'/></FormButton>
                </>
            }
        </StyledContainer>
    );
}
