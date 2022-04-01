import { IS_MAINNET, SHOW_PRERELEASE_WARNING } from '../config';

export default (https = true) => {
    let networkName = '';

    if (SHOW_PRERELEASE_WARNING) {
        networkName = 'staging.';
    }
    if (!IS_MAINNET) {
        networkName = 'testnet.';
    }

    return `${https ? 'https://' : ''}wallet.${networkName}near.org`;
};
