import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { ACCOUNT_ID_SUFFIX } from '../../../config/settings';
import SafeTranslate from '../SafeTranslate';

const Container = styled.div`
    font-style: italic;
    padding: 10px 0 20px 0;
    font-size: 13px;
    color: #A2A2A8;
    
    p {
        margin-bottom: 5px;
    }

    ul {
        margin-top: 0;
        padding-left: 17px;
    }
`;

const AccountNote = () => (

    <Container>
        <p><Translate id='createAccount.note.canContain'/></p>
        <ul>
            <li><Translate id='createAccount.note.lowercase'/></li>
            <li><Translate id='createAccount.note.digits'/></li>
            <li><Translate id='createAccount.note.separators'/></li>
        </ul>
        <p><Translate id='createAccount.note.cannotContain'/></p>
        <ul>
            <li><Translate id='createAccount.note.characters'/></li>
            <li><Translate id='createAccount.note.minCharacters'/></li>
            <li><SafeTranslate id='createAccount.note.maxCharacters' data={{ accountSuffix: ACCOUNT_ID_SUFFIX }}/></li>
        </ul>
    </Container>
);

export default AccountNote;
