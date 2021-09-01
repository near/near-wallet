import { connectRouter } from 'connected-react-router';
import { localizeReducer } from 'react-localize-redux';
import { combineReducers } from 'redux';

import allAccounts from '../reducers/allAccounts';
import recoveryMethods from '../reducers/recoveryMethods';
import nftSlice from '../redux/slices/nft';
import tokensSlice from '../redux/slices/tokens';
import transactionsSlice from '../redux/slices/transactions';
import flowLimitationSlice from '../redux/slices/flowLimitation';
import linkdropSlice from '../slices/linkdrop';
import tokenFiatValuesSlice from '../slices/tokenFiatValues';
import account from './account';
import availableAccounts from './available-accounts';
import ledger from './ledger';
import sign from './sign';
import staking from './staking';
import status from './status';

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
