import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux'

import DocImg from '../../images/icon-phrase.svg';

const SetUpPhraseBlock = styled.div`
   padding: 20px 0 0 0;
   border-top: 4px solid #f8f8f8 !important;
   margin-top: 48px;
   max-width: 500px;

   .headline {
        font-weight: 600;
        color: #24272a;
   }

   .desc {
        color: #4a4f54;
        font-size: 11px;
   }

   .button {
        background: left 10px bottom 10px no-repeat url(${DocImg});
        background-size: 20px;
        border: 2px solid #e6e6e6;
        background-color: #f8f8f8;
        border-radius: 3px;
        color: #24272a;
        display: inline-block;
        cursor: pointer;
        padding: 10px 10px 10px 40px;
        margin-top: 10px;
        display: inline-block !important;

        > span > span {
            font-weight: 600;
        }
   }
`;

const AccountSkipThisStep = ({ skipRecoverySetup }) => (
    <SetUpPhraseBlock>
        <div className='headline'><Translate id='setRecovery.switchToManualBackup.title' /></div>
        <div className='desc'><Translate id='setRecovery.switchToManualBackup.text' /></div>
        <div className='button' onClick={skipRecoverySetup}><Translate id='setRecovery.switchToManualBackup.button' /></div>
    </SetUpPhraseBlock>
)

export default AccountSkipThisStep
