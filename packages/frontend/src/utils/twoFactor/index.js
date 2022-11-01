import { store } from '../..';
import { promptTwoFactor, refreshAccount } from '../../redux/actions/account';
import { TwoFactorBase } from './twoFactorBase';

export class TwoFactor extends TwoFactorBase {
    constructor(wallet, accountId, has2fa = false) {
        super({
            connection: wallet.connection,
            accountId,
            getCode: () => store.dispatch(promptTwoFactor(true)).payload.promise,
            init2fa: ({ accountId, method }) => wallet.postSignedJson('/2fa/init', {
                accountId,
                method
            }),
            isLedgerEnabled: () => wallet.isLedgerEnabled(),
            localStorage,
            refreshAccount: () => store.dispatch(refreshAccount()),
            has2fa,
        });
    }
}
