import React from 'react'

import styled from 'styled-components'
import { QRCode } from "react-qr-svg";

const CustomDiv = styled.div`
    & {
        text-align: center;
    }

    h2 {
        margin-bottom: 1em;
    }
    
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
        <p>Use your phones camera app to send to this address.</p>
   </CustomDiv>
)

export default ProfileQRCode
