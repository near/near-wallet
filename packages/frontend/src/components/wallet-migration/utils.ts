import { getMyNearWalletUrl } from '../../utils/getWalletURL';

export const WALLET_ID = {
    MY_NEAR_WALLET: 'my-near-wallet',
    LEDGER: 'ledger',
    SENDER: 'sender',
    METEOR_WALLET: 'meteor-wallet',
    FINER_WALLET: 'finer-wallet',
    NIGHTLY_WALLET: 'nightly-wallet'
};

export const isAccountBricked = async (account) => {
    // If account is bricked and unable to run checkMultisigCodeAndStateStatus
    if (!account.checkMultisigCodeAndStateStatus) {
        return true;
    }
    // If current multisig contract status is at 'Cannot deserialize the contract state.', it is bricked
    const { codeStatus, stateStatus } = await account.checkMultisigCodeAndStateStatus();
    if (codeStatus === 1 && stateStatus === 0) {
        return true;
    }
    return false;
};

export const download = (filename, text) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
};

export const setMigrationStep = (step) => localStorage.setItem('walletMigrationStep', step);

export const getMigrationStep = () => localStorage.getItem('walletMigrationStep');

export const deleteMigrationStep = () => localStorage.removeItem('walletMigrationStep');

export const redirectLinkdropUser = ({
    fundingContract,
    fundingKey,
    walletID,
    destination
}) => {
    if (walletID === WALLET_ID.MY_NEAR_WALLET) {
        return window.location.href = getMyNearWalletUrl() + `/${destination}/${fundingContract}/${fundingKey}`;
    }
};


