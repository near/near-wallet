import { connectRouter } from 'connected-react-router';
import { localizeReducer } from 'react-localize-redux';
import { combineReducers } from 'redux';

import account from '../redux/reducers/account';
import allAccounts from '../redux/reducers/allAccounts';
import availableAccounts from '../redux/reducers/available-accounts';
import ledger from '../redux/reducers/ledger';
import recoveryMethods from '../redux/reducers/recoveryMethods';
import sign from '../redux/reducers/sign';
import staking from '../redux/reducers/staking';
import status from '../redux/reducers/status';
import flowLimitationSlice from '../redux/slices/flowLimitation';
import nftSlice from '../redux/slices/nft';
import tokensSlice from '../redux/slices/tokens';
import transactionsSlice from '../redux/slices/transactions';
import linkdropSlice from '../slices/linkdrop';
import tokenFiatValuesSlice from '../slices/tokenFiatValues';

export default (history) => combineReducers({
    localize: localizeReducer,
    allAccounts,
    availableAccounts,
    account,
    sign,
    recoveryMethods,
    ledger,
    staking,
    status,
    [nftSlice.name]: nftSlice.reducer,
    [tokenFiatValuesSlice.name]: tokenFiatValuesSlice.reducer,
    [linkdropSlice.name]: linkdropSlice.reducer,
    [transactionsSlice.name]: transactionsSlice.reducer,
    [tokensSlice.name]: tokensSlice.reducer,
    [flowLimitationSlice.name]: flowLimitationSlice.reducer,
    router: connectRouter(history)
});
