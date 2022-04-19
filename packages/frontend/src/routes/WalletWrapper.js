import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Wallet } from '../components/wallet/Wallet';
import { useFungibleTokensIncludingNEAR } from '../hooks/fungibleTokensIncludingNEAR';
import { Mixpanel } from '../mixpanel/index';
import { selectAccountId, selectBalance, selectAccountExists } from '../redux/slices/account';
import { selectAvailableAccounts } from '../redux/slices/availableAccounts';
import { selectCreateFromImplicitSuccess, selectCreateCustomName, actions as createFromImplicitActions } from '../redux/slices/createFromImplicit';
import { selectLinkdropAmount, actions as linkdropActions } from '../redux/slices/linkdrop';
import { selectTokensWithMetadataForAccountId, actions as nftActions } from '../redux/slices/nft';
import { actions as tokensActions, selectTokensLoading } from '../redux/slices/tokens';

const { fetchNFTs } = nftActions;
const { fetchTokens } = tokensActions;
const { setLinkdropAmount } = linkdropActions;
const { setCreateFromImplicitSuccess, setCreateCustomName } = createFromImplicitActions;

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
    const fungibleTokensList = useFungibleTokensIncludingNEAR();
    const tokensLoading = useSelector((state) => selectTokensLoading(state, { accountId }));
    const availableAccounts = useSelector(selectAvailableAccounts);
    const sortedNFTs = useSelector((state) => selectTokensWithMetadataForAccountId(state, { accountId }));

    useEffect(() => {
        if (accountId) {
            Mixpanel.identify(Mixpanel.get_distinct_id());
            Mixpanel.people.set({ relogin_date: new Date().toString() });
            
            dispatch(fetchNFTs({ accountId }));
            dispatch(fetchTokens({ accountId }));
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
            fungibleTokensList={fungibleTokensList}
            tokensLoading={tokensLoading}
            availableAccounts={availableAccounts}
            sortedNFTs={sortedNFTs}
            handleCloseLinkdropModal={
                useCallback(() => {
                    dispatch(setLinkdropAmount('0'));
                    Mixpanel.track('Click dismiss NEAR drop success modal');
                },[])
            }
            handleSetCreateFromImplicitSuccess={() => dispatch(setCreateFromImplicitSuccess(false))}
            handleSetCreateCustomName={() => dispatch(setCreateCustomName(false))}
        />
    );
}
