import { createAction } from 'redux-actions';

import sendJson from '../tmp_fetch_send_json';
import { ACCOUNT_HELPER_URL } from '../utils/wallet';

export const getTokenFiatValue = createAction('GET_TOKEN_FIAT_VALUE', async () => {
    return await sendJson('GET', ACCOUNT_HELPER_URL + `/fiat`);
});

