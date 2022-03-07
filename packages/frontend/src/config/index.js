import { defaults } from 'lodash';

import Environments from '../../../../features/environments.json';
import environmentConfig from './configFromEnvironment';
import development from './environmentDefaults/development';
import mainnet from './environmentDefaults/mainnet';
import mainnet_STAGING from './environmentDefaults/mainnet_STAGING';
import testnet from './environmentDefaults/testnet';

const envDefaults = {
    [Environments.DEVELOPMENT]: development,
    [Environments.TESTNET]: testnet,
    [Environments.MAINNET]: mainnet,
    [Environments.MAINNET_STAGING]: mainnet_STAGING,
};

module.exports = defaults(
    environmentConfig,
    envDefaults[environmentConfig.NEAR_WALLET_ENV]
);
