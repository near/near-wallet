import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import QRCode from "qrcode.react";

const CustomDiv = styled.div`
    text-align: center;

    p {
        margin-top: 1em;
    }
`

const ProfileQRCode = ({ accountId }) => (
   <CustomDiv className='qr-code-container'>
        <QRCode
            bgColor="#FFFFFF"
            fgColor="#24272a"
            level="Q"
            style={{ width: "100%", height: '100%' }}
            renderAs='svg'
            value={`${window.location.protocol}//${window.location.host}/send-money/${accountId}`}
        />
        <p><Translate id='profile.details.qrDesc' /></p>
   </CustomDiv>
)

export default ProfileQRCode
