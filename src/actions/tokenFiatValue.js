import { createAction } from 'redux-actions';

import sendJson from '../tmp_fetch_send_json';
import { ACCOUNT_HELPER_URL } from '../utils/wallet';

export const getTokenFiatValue = createAction('GET_TOKEN_FIAT_VALUE', async () => {
    try {
        return await sendJson('GET', ACCOUNT_HELPER_URL + `/fiat`);
    } catch {
        // TODO: Remove dummy data when end point in contract-helper is available
        return { near: { usd: 2.14, last_updated_at: 1627347839 } };
    }
});

