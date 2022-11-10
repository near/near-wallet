import CONFIG from '../config';
import { wallet } from '../utils/wallet';

export async function checkAddress ({ accountId }) {
    const viewFunctionAccount = wallet.getAccountBasic('dontcare');
    return viewFunctionAccount.viewFunction(
        CONFIG.HAPI_PROTOCOL_ADDRESS,
        'get_address',
        { address: accountId }
    );
}
