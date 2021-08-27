import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

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

const AutoImport = ({
    accountId,
    recoveryFailed,
    onClickRecoverWithSecretKey,
    onCancel
}) => (
    <StyledContainer className='small-centered'>
        {recoveryFailed
            ? <>
                <h1>
                    <Translate
                        id={`importAccount.${accountId ? 'withIdFailed' : 'noIdFailed'}`}
                        data={{ accountId: accountId }}
                    />
                </h1>
                <FormButton onClick={onClickRecoverWithSecretKey}><Translate id='button.tryAgain' /></FormButton>
                {onCancel
                    ? <FormButton color='gray-blue' onClick={onCancel}><Translate id='button.cancel' /></FormButton>
                    : <FormButton color='gray-blue' linkTo='/create'><Translate id='button.createNewAccount' /></FormButton>
                }
            </>
            : <h1 className='animated-dots'>
                <Translate
                    id={`importAccount.${accountId ? 'withId' : 'noId'}`}
                    data={{ accountId: accountId }}
                />
            </h1>
        }
    </StyledContainer>
);

export default AutoImport;