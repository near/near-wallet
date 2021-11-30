import { createAsyncThunk } from '@reduxjs/toolkit';

import { wallet } from '../../utils/wallet';

export default createAsyncThunk(
    `refreshAccountOwner`,
    async ({ limitedAccountData }) => {
        return await wallet.refreshAccount(limitedAccountData);
    }
);
