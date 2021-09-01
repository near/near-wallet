const SLICE_NAME = 'flowLimitation';

const initialState = {
    mainMenu: false,
    subMenu: false,
    accountPages: false,
    accountData: false,
    accountBalance: false
};

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
