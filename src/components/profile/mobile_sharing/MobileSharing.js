import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../common/FormButton';
import MobileSharingModal from './MobileSharingModal';

const MobileSharing = ({
    onSetMobileSharingLink,
    mobileSharingLink
}) => {
    const [showMobileSharingModal, setShowMobileSharingModal] = useState(false);
    return (
        <>
            <hr/>
            <h2><Translate id='profile.mobileSharing.title'/></h2>
            <div className='sub-heading'><Translate id='profile.mobileSharing.desc'/></div>
            <FormButton
                color='gray-blue'
                onClick={() => {
                    setShowMobileSharingModal(true);
                    onSetMobileSharingLink();
                }}
            >
                <Translate id='profile.mobileSharing.button'/>
            </FormButton>
            {showMobileSharingModal &&
                <MobileSharingModal
                    open={showMobileSharingModal}
                    onClose={() => {
                        setShowMobileSharingModal(false);
                        onSetMobileSharingLink('clear');
                    }}
                    mobileSharingLink={mobileSharingLink}
                />
            }
        </>
    );
};

export default MobileSharing;