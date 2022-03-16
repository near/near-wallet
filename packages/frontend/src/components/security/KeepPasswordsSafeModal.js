import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Button from '../common/Button';
import Modal from '../common/modal/Modal';

const Container = styled.section`
    width: 100%;
    text-align:center;
    
    .header {
        padding: 24px 16px;
        border-bottom: 1px solid #F0F0F1;

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

    .ctaBtn{
        margin-top: 16px;
    }


  
`;

const KeepPasswordsSafeModal = ({ isOpen, onClose }) => {
  return (
    <Modal
        id='keep-passwords-safe-modal'
        isOpen={isOpen}
        onClose={onClose}
        disableClose={true}
        modalSize="sm"
    >
        <Container>
           <header className='header'>
                <h2 className='ttl'><Translate id="keepPasswordsSafeModal.ttl"/></h2>
                <p className='desc'><Translate id="keepPasswordsSafeModal.desc"/></p>
           </header>
            <Button className="ctaBtn" onClick={onClose}>
                <Translate id="button.gotIt"/>
            </Button>
        </Container>
    </Modal>
  );
};

export default KeepPasswordsSafeModal;
