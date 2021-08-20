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

const tokensSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
    extraReducers: ((builder) => {
});
});
