import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Modal from "../../common/modal/Modal";
import MobileSharingQRCode from './MobileSharingQRCode';

const StyledContainer = styled.div`
    &&& {
        padding: 40px 0;
        text-align: center;
        font-weight: normal;

        h2 {
            color: #24272a;
        }

        .desc {
            color: #72727A;
            font-size: 16px;
            margin: 30px auto;
            max-width: 400px;
            line-height: 150%;
        }
    
        > button {
            width: 100%;
            max-width: 400px;
            margin: 40px auto;
            display: block;
        }
    }
`;

const MobileSharingModal = ({ open, onClose, mobileSharingLink }) => {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            closeButton='desktop'
        >
            <StyledContainer>
                <h2><Translate id='profile.mobileSharing.modal.title'/></h2>
                <div className='desc'><Translate id='profile.mobileSharing.modal.desc'/></div>
                <MobileSharingQRCode value={mobileSharingLink}/>
            </StyledContainer>
        </Modal>
    );
};

export default MobileSharingModal;