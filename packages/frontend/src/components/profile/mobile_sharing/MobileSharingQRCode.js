import QRCode from 'qrcode.react';
import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import classNames from '../../../utils/classNames';
import FormButton from '../../common/FormButton';
import EyeIcon from '../../svg/EyeIcon';

const StyledContainer = styled.div`
    &&& {
        border: 1px solid #F0F0F1;
        border-radius: 8px;
        max-width: 270px;
        margin: 0 auto;
        position: relative;
        .qr-wrapper {
            padding: 20px;
            filter: blur(4px);
            opacity: 0.2;
            &.show {
                filter: none;
                opacity: 1;
            }
        }
        @media (max-width: 500px) {
            max-width: 220px;
        }
        > button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            margin: 0;
            height: auto;
            display: flex;
            align-items: center;
            padding: 6px 20px;
            width: auto;
            > svg {
                width: 24px;
                height: 24px;
                margin: 0 10px 0 0;
            }
        }
    }
`;

const ImportOnMobileDeviceQRCode = ({ mobileSharingLink }) => {
    const [showCode, setShowCode] = useState(false);
    return (
        <StyledContainer>
            <div className={classNames(['qr-wrapper', { 'show' : showCode }])}>
                <QRCode
                    bgColor="#FFFFFF"
                    fgColor="#24272a"
                    level="Q"
                    style={{ width: "100%", height: '100%' }}
                    renderAs='svg'
                    value={`${mobileSharingLink}`}
                />
            </div>
            {!showCode &&
                <FormButton onClick={() => setShowCode(true)}>
                    <EyeIcon/>
                    <Translate id='mobileDeviceAccess.showCode.modal.reveal'/>
                </FormButton>
            }
        </StyledContainer>
    );
};

export default ImportOnMobileDeviceQRCode;