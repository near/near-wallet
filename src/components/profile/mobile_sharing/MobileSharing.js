import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../common/FormButton';
import QRCodeIcon from '../../svg/QRCodeIcon';
import SmartPhoneIcon from '../../svg/SmartPhoneIcon';
import MobileSharingModal from './MobileSharingModal';

const QRCodeButton = styled(FormButton)`
    &&& {
        display: flex;
        align-items: center;
        justify-content: center;

        > svg {
            width: 22px;
            height: 22px;
            margin: 0 15px 0 0;
        }
    }
`;

const MobileSharing = ({
    mobileSharingLink
}) => {
    const [showMobileSharingModal, setShowMobileSharingModal] = useState(false);
    return (
        <>
            <hr/>
            <h2><SmartPhoneIcon/><Translate id='profile.mobileSharing.title'/></h2>
            <div className='sub-heading'><Translate id='profile.mobileSharing.desc'/></div>
            <QRCodeButton
                color='gray-blue'
                onClick={() => setShowMobileSharingModal(true)}
            >
                <QRCodeIcon/>
                <Translate id='profile.mobileSharing.button'/>
            </QRCodeButton>
            {showMobileSharingModal &&
                <MobileSharingModal
                    open={showMobileSharingModal}
                    onClose={() => setShowMobileSharingModal(false)}
                    mobileSharingLink={mobileSharingLink}
                />
            }
        </>
    );
};

export default MobileSharing;