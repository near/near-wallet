import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Modal from "../../common/modal/Modal";
import AlertTriangleIcon from '../../svg/AlertTriangleIcon';
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
            margin: 40px auto;
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

    .disclaimer {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #995200;
        background-color: #FFECD6;
        font-size: 16px;
        line-height: 170%;
        padding: 30px;
        border-radius: 8px;
        margin-bottom: 40px;

        > span {
            margin-top: 25px;
            max-width: 450px;
        }
    }

    .alert-triangle {
        background-color: #FFDBB2;
        border-radius: 50%;
        width: 65px;
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: center;

        > svg {
            min-width: 30px;
            min-height: 30px;
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
                <h2><Translate id='mobileDeviceAccess.showCode.modal.title'/></h2>
                <div className='desc'><Translate id='mobileDeviceAccess.showCode.modal.desc'/></div>
                <div className='disclaimer'>
                    <div className='alert-triangle'><AlertTriangleIcon color='#995200'/></div>
                    <Translate id='mobileDeviceAccess.showCode.modal.disclaimer'/>
                </div>
                <MobileSharingQRCode mobileSharingLink={mobileSharingLink}/>
            </StyledContainer>
        </Modal>
    );
};

export default MobileSharingModal;