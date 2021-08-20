const SLICE_NAME = 'tokens';

const initialState = {
    ownedTokens: {
        byAccountId: {}
    },
    metadata: {
        byContractName: {}
    }
};

const initialOwnedTokenState = {
    balance: '',
    loading: false,
    error: null
};

const fetchOwnedTokensForContract = createAsyncThunk(
    `${SLICE_NAME}/fetchOwnedTokensForContract`,
    async ({ accountId, contractName }, thunkAPI) => {
    }
);

const fetchTokens = createAsyncThunk(
    `${SLICE_NAME}/fetchTokens`,
    async ({ accountId }, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;

        const likelyContracts = [...new Set([...(await getLikelyTokenContracts({ accountId })), ...WHITELISTED_CONTRACTS])];

        await Promise.all(likelyContracts.map(async contractName => {
            const { actions: { setContractMetadata } } = tokensSlice;
            try {
                const contractMetadata = await getCachedContractMetadataOrFetch(contractName, accountId, getState());
                if (!selectOneContractMetadata(getState(), { contractName })) {
                    dispatch(setContractMetadata({ contractName, metadata: contractMetadata }));
                }
                await dispatch(fetchOwnedTokensForContract({ accountId, contractName, contractMetadata }));
            } catch (e) {
                // Continue loading other likely contracts on failures
                console.warn(`Failed to load FT for ${contractName}`, e);
            }
        }));
    }
);

const tokensSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setContractMetadata(state, { payload }) {
            const { metadata, contractName } = payload;
            set(state, ['metadata', 'byContractName', contractName], metadata);
        },
        addTokensMetadata(state, { payload }) {
            const { contractName, balance, accountId } = payload;
            set(state, ['ownedTokens', 'byAccountId', accountId, contractName, 'balance'], balance);
        },
    },
    extraReducers: ((builder) => {
    }
});

export default tokensSlice;

export const actions = {
    fetchTokens,
    ...tokensSlice.actions
};
export const reducer = tokensSlice.reducer; 
