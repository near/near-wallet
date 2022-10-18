import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Wallet } from '../components/wallet/Wallet';
import useSortedTokens from '../hooks/useSortedTokens';
import { Mixpanel } from '../mixpanel/index';
import { selectAccountId, selectBalance, selectAccountExists } from '../redux/slices/account';
import { selectAvailableAccounts } from '../redux/slices/availableAccounts';
import { selectCreateFromImplicitSuccess, selectCreateCustomName, actions as createFromImplicitActions } from '../redux/slices/createFromImplicit';
import { selectZeroBalanceAccountImportMethod, actions as importZeroBalanceAccountActions } from '../redux/slices/importZeroBalanceAccount';
import { selectLinkdropAmount, actions as linkdropActions } from '../redux/slices/linkdrop';
import { selectTokensWithMetadataForAccountId, actions as nftActions } from '../redux/slices/nft';
import { actions as recoveryMethodsActions, selectRecoveryMethodsByAccountId } from '../redux/slices/recoveryMethods';
import { selectTokensLoading, selectAllowedTokens } from '../redux/slices/tokens';

const { fetchNFTs } = nftActions;
const { setLinkdropAmount } = linkdropActions;
const { setCreateFromImplicitSuccess, setCreateCustomName } = createFromImplicitActions;
const { setZeroBalanceAccountImportMethod } = importZeroBalanceAccountActions;
const { fetchRecoveryMethods } = recoveryMethodsActions;


export function WalletWrapper({
    tab,
    setTab
}) {
    const accountId = useSelector(selectAccountId);
    const accountExists = useSelector(selectAccountExists);
    const balance = useSelector(selectBalance);
    const dispatch = useDispatch();
    const linkdropAmount = useSelector(selectLinkdropAmount);
    const createFromImplicitSuccess = useSelector(selectCreateFromImplicitSuccess);
    const createCustomName = useSelector(selectCreateCustomName);
    const zeroBalanceAccountImportMethod = useSelector(selectZeroBalanceAccountImportMethod);
    const tokensLoading = useSelector((state) => selectTokensLoading(state, { accountId }));
    const availableAccounts = useSelector(selectAvailableAccounts);
    const sortedNFTs = useSelector((state) => selectTokensWithMetadataForAccountId(state, { accountId }));
    const userRecoveryMethods = useSelector((state) => selectRecoveryMethodsByAccountId(state, { accountId }));
    const allowedTokens = useSelector(selectAllowedTokens);
    const sortedTokens = useSortedTokens(allowedTokens);

    useEffect(() => {
        if (accountId) {
            Mixpanel.identify(Mixpanel.get_distinct_id());
            Mixpanel.people.set({ relogin_date: new Date().toString() });

            dispatch(fetchNFTs({ accountId }));

            if (userRecoveryMethods.length === 0) {
                dispatch(fetchRecoveryMethods({ accountId }));
            }
        }
    }, [accountId]);

    return (
        <Wallet
            tab={tab}
            setTab={setTab}
            accountId={accountId}
            accountExists={accountExists}
            balance={balance}
            linkdropAmount={linkdropAmount}
            createFromImplicitSuccess={createFromImplicitSuccess}
            createCustomName={createCustomName}
            zeroBalanceAccountImportMethod={zeroBalanceAccountImportMethod}
            fungibleTokensList={sortedTokens}
            tokensLoading={tokensLoading}
            availableAccounts={availableAccounts}
            sortedNFTs={sortedNFTs}
            handleCloseLinkdropModal={
                useCallback(() => {
                    dispatch(setLinkdropAmount('0'));
                    Mixpanel.track('Click dismiss NEAR drop success modal');
                }, [])
            }
            handleSetCreateFromImplicitSuccess={() => dispatch(setCreateFromImplicitSuccess(false))}
            handleSetCreateCustomName={() => dispatch(setCreateCustomName(false))}
            handleSetZeroBalanceAccountImportMethod={() => dispatch(setZeroBalanceAccountImportMethod(''))}
            userRecoveryMethods={userRecoveryMethods}
        />
    );
}
