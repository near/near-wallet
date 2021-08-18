import { createAsyncThunk } from '@reduxjs/toolkit';

import { handleRefreshUrl, makeAccountActive, refreshAccount } from '../../../actions/account';
import { staking } from '../../../actions/staking';
import { tokens } from '../../../actions/tokens';
import nftSlice from '../../../reducers/nft';

const SLICE_NAME = 'account';

export const switchAccount = createAsyncThunk(
    `${SLICE_NAME}/switchAccount`,
    async (accountId, { dispatch }) => {
        dispatch(makeAccountActive(accountId));
        dispatch(handleRefreshUrl());
        dispatch(staking.clearState());
        dispatch(refreshAccount());
        dispatch(tokens.clearState());
        dispatch(nftSlice.actions.clearState());
    }
);