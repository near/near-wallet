import tokensSlice from './slices/tokens';

export default () => ({
    [tokensSlice.name]: tokensSlice.reducer
});
