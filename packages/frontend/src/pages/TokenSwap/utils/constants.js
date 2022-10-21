import { USN_CONTRACT } from '../../../config';

// Amount of decimal places to save in the displayed amounts.
// Not used in the real calculations.
export const DECIMALS_TO_SAFE = 7;

// The number of milliseconds before making a request for swap information
// after the user changes the input amount.
export const SWAP_INFO_DELAY = 400;

// Token pool IDs are array indexes, we use this value
// to delete the current pool from the state for tokens in the form.
export const IMPOSSIBLE_POOL_ID = -1;

// Used in swap form notifications
export const NOTIFICATION_TYPE = {
    info: 'info',
    warning: 'warning',
    error: 'error',
};

// Percentage of price impact in swaps.
// Used to let users know about possible losses.
export const PRICE_IMPACT_THRESHOLD = {
    warning: 4,
    error: 10,
};

// Used to initialize output token in the form.
export const DEFAULT_OUTPUT_TOKEN_ID = USN_CONTRACT || '';

export const DEFAULT_SLIPPAGE_PERCENT = 1;

// Precalculated unit amounts for common swap actions.
export const SWAP_GAS_UNITS = {
    nearWithWnear: '6000000000000', // for deposit or withdraw NEAR
    nearWithFT: '41000000000000', // for deposit or withdraw NEAR and a swap action
    ftWithFt: '35000000000000', // for a swap action
};
