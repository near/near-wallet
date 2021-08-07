import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../common/FormButton';
import Modal from "../common/modal/Modal";
import ImportOnMobileDeviceQRCode from './ImportOnMobileDeviceQRCode';

const StyledContainer = styled.div`
    &&& {
        h2 {
            font-size: 20px;
            font-weight: normal;
            text-align: center;
            margin: 40px 0;
        }
    
        > button {
            width: 100%;
            max-width: 400px;
            margin: 40px auto;
            display: block;
        }
    }
`;

const ImportOnMobileDeviceModal = ({ open, onClose, secretKeyImportLink }) => {
    return (
        <Modal
            id='import-on-mobile-device-modal'
            isOpen={open}
            onClose={onClose}
            closeButton='desktop'
        >
            <StyledContainer>
                <h2 className='title'><Translate id='profile.importOnMobileDevice.modal.title'/></h2>
                <ImportOnMobileDeviceQRCode value={secretKeyImportLink}/>
                <FormButton color='gray-white' id='close-button'>
                    <Translate id='button.dismiss'/>
                </FormButton>
            </StyledContainer>
        </Modal>
    );
};

export default ImportOnMobileDeviceModal;