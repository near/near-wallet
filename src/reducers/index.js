import { connectRouter } from 'connected-react-router';
import { localizeReducer } from 'react-localize-redux';
import { combineReducers } from 'redux';

import allAccounts from '../reducers/allAccounts';
import recoveryMethods from '../reducers/recoveryMethods';
import account from './account';
import availableAccounts from './available-accounts';
import flowLimitation from './flowLimitation';
import ledger from './ledger';
import { reducer as nftReducer } from './nft';
import sign from './sign';
import staking from './staking';
import status from './status';
import tokens from './tokens';
import transactions from './transactions';

export default (history) => combineReducers({
    localize: localizeReducer,
    allAccounts,
    availableAccounts,
    account,
    transactions,
    sign,
    recoveryMethods,
    ledger,
    staking,
    status,
    flowLimitation,
    tokens,
    nft: nftReducer,
    router: connectRouter(history)
});
