import { IS_MAINNET, SHOW_PRERELEASE_WARNING } from '../config';
import { isWhitelabel } from '../config/whitelabel';

export default (https = true) => {
    let networkName = '';

    if (SHOW_PRERELEASE_WARNING) {
        networkName = 'staging.';
    } else if (!IS_MAINNET) {
        networkName = 'testnet.';
    }

    const protocol = https ? 'https://' : '';
    if (isWhitelabel) {
        return `${protocol}app.mynearwallet.com`;
    }

    return `${protocol}wallet.${networkName}near.org`;
};
