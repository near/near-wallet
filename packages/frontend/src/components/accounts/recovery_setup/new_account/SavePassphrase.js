import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Container from '../../../common/styled/Container.css';
import SetupSeedPhraseForm from '../../SetupSeedPhraseForm';

const AccountIdContainer = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 800;
`;

export default ({
    passPhrase,
    refreshPhrase,
    onClickContinue,
    onClickCancel,
    accountId,
    style,
}) => {
    return (
        <Container className='small-centered border' style={style}>
            <h1><Translate id='setupSeedPhrase.pageTitle' /></h1>
            {
                accountId && (<h2><AccountIdContainer>{accountId}</AccountIdContainer></h2>)
            }
            <h2><Translate id='setupSeedPhrase.pageText' /></h2>
            <SetupSeedPhraseForm
                seedPhrase={passPhrase}
                refreshData={refreshPhrase}
                onClickContinue={onClickContinue}
                onClickCancel={onClickCancel}
            />
        </Container>
    );
};
