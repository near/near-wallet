import QRCode from "qrcode.react";
import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

const CustomDiv = styled.div`
    text-align: center;

    p {
        margin-top: 1em;
    }
`;

const ProfileQRCode = ({ accountId }) => (
   <CustomDiv className='qr-code-container'>
        <QRCode
            bgColor="#FFFFFF"
            fgColor="#24272a"
            level="Q"
            style={{ width: "100%", height: '100%' }}
            renderAs='svg'
            value={`${accountId}`}
        />
        <p><Translate id='profile.details.qrDesc' /></p>
   </CustomDiv>
);

export default ProfileQRCode;
