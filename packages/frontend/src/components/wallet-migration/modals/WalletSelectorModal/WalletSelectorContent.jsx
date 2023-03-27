import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useExportAccountSelector } from './WalletSelectorExportContext';

export const WalletSelectorContent = () => {
    const { ExportModal } = useExportAccountSelector();
    const location = useLocation();
    useEffect(() => {
        if (ExportModal) {
            //TODO: this is to mute css class injected from WalletSelectorGetAWallet component
            const walletWrapperDiv = document.getElementById('near-wallet-selector-modal');
            walletWrapperDiv?.classList.remove('wallet-selector-get-a-wallet-modal');
            ExportModal?.show();
        }
    }, [ExportModal]);

    // On location change, close the modal
    useEffect(() => {
        ExportModal?.hide();
    }, [location]);
    return null;
};
