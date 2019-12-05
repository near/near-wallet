import React from 'react'
import styled from 'styled-components'
import DocImg from '../../images/icon-doc.svg'

const SetUpPhraseBlock = styled.div`
   padding: 20px 0 0 0;
   border-top: 4px solid #f8f8f8 !important;
   margin-top: 48px;

   .headline {
      font-weight: 600;
      color: #24272a;
   }

   .desc {
      color: #4a4f54;
      font-size: 11px;
   }

   .button {
      background: left 10px center no-repeat url(${DocImg});
      background-size: 20px;
      border: 2px solid #e6e6e6;
      background-color: #f8f8f8;
      border-radius: 3px;
      color: #24272a;
      display: inline-block;
      cursor: pointer;
      padding: 10px 10px 10px 40px;
      margin-top: 10px;
      span {
         font-weight: 600;
      }
   }
`

const AccountSkipThisStep = ({ skipRecoverySetup }) => (
   <SetUpPhraseBlock onClick={skipRecoverySetup}>
      <div className='headline'>Switch to Manual Backup</div>
      <div className='desc'>With this option, NEAR will not be able to assist you with account recovery.</div>
      <div className='button'>
         Setup <span>Recovery Phrase</span>
      </div>
   </SetUpPhraseBlock>
)

export default AccountSkipThisStep
