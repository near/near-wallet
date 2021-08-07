import QRCode from 'qrcode.react';
import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
    border: 1px solid #F0F0F1;
    border-radius: 8px;
    max-width: 270px;
    margin: 0 auto;

    .qr-wrapper {
        padding: 20px;
    }

    @media (max-width: 500px) {
        max-width: 220px;
    }
`;

const ImportOnMobileDeviceQRCode = ({ value }) => {
    return (
        <StyledContainer>
            <div className='qr-wrapper'>
                <QRCode
                    bgColor="#FFFFFF"
                    fgColor="#24272a"
                    level="Q"
                    style={{ width: "100%", height: '100%' }}
                    renderAs='svg'
                    value={`${value}`}
                />
            </div>
        </StyledContainer>
    );
};

export default ImportOnMobileDeviceQRCode;