import React from 'react';
import { Translate } from 'react-localize-redux';

import Container from '../../../common/styled/Container.css';
import SetupSeedPhraseForm from '../../SetupSeedPhraseForm';

type SavePassphraseProps = {
    passPhrase: string;
    refreshPhrase:()=> void;
    onClickContinue:()=>void;
}

export default ({
    passPhrase,
    refreshPhrase,
    onClickContinue
}:SavePassphraseProps) => {
    return (
        <Container className='small-centered border'>
            <h1><Translate id='setupSeedPhrase.pageTitle' /></h1>
            <h2><Translate id='setupSeedPhrase.pageText' /></h2>
            {/*//@ts-ignore*/}
            <SetupSeedPhraseForm
                seedPhrase={passPhrase}
                refreshData={refreshPhrase}
                onClickContinue={onClickContinue}
            />
        </Container>
    );
};
