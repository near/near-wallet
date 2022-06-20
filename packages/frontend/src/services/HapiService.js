import { HAPI_PROTOCOL_ADDRESS } from '../config';
import { wallet } from '../utils/wallet';

export default class HapiService {
    // View functions are not signed, so do not require a real account!
    static viewFunctionAccount = wallet.getAccountBasic('dontcare');

    static async checkAddress({ accountId }) {
      return this.viewFunctionAccount.viewFunction(
          HAPI_PROTOCOL_ADDRESS,
          'get_address',
          { address: accountId }
      );
  }
}
