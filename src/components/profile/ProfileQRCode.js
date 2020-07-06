import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import { QRCode } from "react-qr-svg";

const CustomDiv = styled.div`
    text-align: center;

    p {
        margin-top: 1em;
    }
`

const ProfileQRCode = ({ account }) => (
   <CustomDiv className='qr-code-container'>
        <QRCode
            bgColor="#FFFFFF"
            fgColor="#24272a"
            level="Q"
            style={{ width: "100%" }}
            value={`${window.location.protocol}//${window.location.host}/send-money/${account.accountId}`}
        />
        <p><Translate id='profile.details.qrDesc' /></p>
   </CustomDiv>
)

export default ProfileQRCode
