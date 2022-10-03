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
