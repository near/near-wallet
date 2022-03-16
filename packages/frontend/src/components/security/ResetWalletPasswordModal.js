import React, {useState} from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Button from '../common/Button';
import Checkbox from '../common/Checkbox';
import Modal from '../common/modal/Modal';

const Container = styled.section`
    width: 100%;
    text-align:center;
    
    .header {
        padding: 24px 16px;

        .ttl {
            color: #24272A;
        }

        .desc {
            margin-top:16px;
            font-size: 16px;
            line-height: 150%;
            text-align: center;
            color: #72727A;
        }
    }
    
    .consentWrapper{
        background: #FFDEDF;
        display: flex;
        padding: 16px;
    }

    .ctaBtn{
        margin-top: 16px;
    }
`;

const ResetWalletPasswordModal = ({ isOpen, onClose }) => {
    const [ consentGranted, setConsentGranted ]=useState(true);
  return (
    <Modal
        id='reset-wallet-modal'
        isOpen={isOpen}
        onClose={onClose}
        modalSize="sm"
    >
        <Container>
           <header className='header'>
                <h2 className='ttl'><Translate id="resetWalletModal.ttl"/></h2>
                <p className='desc'><Translate id="resetWalletModal.desc"/></p>
           </header>
           <div className="consentWrapper">
               <label htmlFor="consent">
                   <Checkbox
                       checked={consentGranted}
                       onChange={(e) => setConsentGranted(e.target.checked)}
                   />
                  <Translate id="resetWalletModal.consentText"/>
               </label>
           </div>
            <Button className="ctaBtn" onClick={onClose} theme="destructive">
                <Translate id="resetWalletModal.buttonCta"/>
            </Button>
            <Button className="ctaBtn" onClick={onClose} theme="secondary">
                <Translate id="button.cancel"/>
            </Button>
        </Container>
    </Modal>
  );
};

export default ResetWalletPasswordModal;
