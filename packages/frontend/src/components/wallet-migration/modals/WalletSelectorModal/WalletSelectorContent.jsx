import { useEffect } from 'react';

import { useExportAccountSelector } from './WalletSelectorExportContext';

export const WalletSelectorContent = () => {
    const { ExportModal } = useExportAccountSelector();
    
    useEffect(() => {
        //TODO: this is to mute css class injected from WalletSelectorGetAWallet component
        const walletWrapperDiv = document.getElementById('near-wallet-selector-modal');
        walletWrapperDiv?.classList.remove('wallet-selector-get-a-wallet-modal');
        ExportModal?.show();
    });
    return null;
};
