const SLICE_NAME = 'flowLimitation';

const initialState = {
    mainMenu: false,
    subMenu: false,
    accountPages: false,
    accountData: false,
    accountBalance: false
};

const handleFlowLimitation = createAsyncThunk(
    `${SLICE_NAME}/handleFlowLimitation`,
    async (_, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;
        const { pathname } = getState().router.location;
        const { redirect_url } = getState().account.url;
        const { actions: { setFlowLimitation } } = flowLimitationSlice;

        const redirectUrl = redirect_url || pathname;

        if (redirectUrl.includes(WALLET_LOGIN_URL)) {
            dispatch(setFlowLimitation({
                mainMenu: true,
                subMenu: false,
                accountPages: false,
                accountData: true,
                accountBalance: true
            }));
        } 
        else if (redirectUrl.includes(WALLET_SIGN_URL)) {
            dispatch(setFlowLimitation({
                mainMenu: true,
                subMenu: true,
                accountPages: true,
                accountData: true,
                accountBalance: false
            }));
        }
    }
);
const flowLimitationSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setFlowLimitation(state, { payload }) {
            assign(state, payload);
        },
        clearFlowLimitation(state) {
            assign(state, initialState);
        }
    }
});
