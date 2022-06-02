import { connectRouter } from 'connected-react-router';
import { localizeReducer } from 'react-localize-redux';

import account from '../reducers/account';
import allAccounts from '../reducers/allAccounts';
import sign from '../reducers/sign';
import staking from '../reducers/staking';
import status from '../reducers/status';
import availableAccountsSlice from '../slices/availableAccounts';
import createFromImplicitSlice from '../slices/createFromImplicit';
import flowLimitationSlice from '../slices/flowLimitation';
import ledgerSlice from '../slices/ledger';
import linkdropSlice from '../slices/linkdrop';
import multiplierSlice from '../slices/multiplier';
import nftSlice from '../slices/nft';
import recoveryMethodsSlice from '../slices/recoveryMethods';
import swapSlice from '../slices/swap';
import tokenFiatValuesSlice from '../slices/tokenFiatValues';
import transactionsSlice from '../slices/transactions';

export default (history) => ({
    // shared reducers
    localize: localizeReducer,
    router: connectRouter(history),
    [tokenFiatValuesSlice.name]: tokenFiatValuesSlice.reducer,
    // account reducers
    allAccounts,
    account,
    sign,
    staking,
    status,
    [nftSlice.name]: nftSlice.reducer,
    [linkdropSlice.name]: linkdropSlice.reducer,
    [transactionsSlice.name]: transactionsSlice.reducer,
    [flowLimitationSlice.name]: flowLimitationSlice.reducer,
    [createFromImplicitSlice.name]: createFromImplicitSlice.reducer,
    [recoveryMethodsSlice.name]: recoveryMethodsSlice.reducer,
    [availableAccountsSlice.name]: availableAccountsSlice.reducer,
    [ledgerSlice.name]: ledgerSlice.reducer,
    [multiplierSlice.name]: multiplierSlice.reducer,
    [swapSlice.name]: swapSlice.reducer
});
