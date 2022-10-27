import environmentConfig from './configFromEnvironment';
import ENVIRONMENT from './enviroment';
import development from './environmentDefaults/development';
import mainnet from './environmentDefaults/mainnet';
import mainnet_STAGING from './environmentDefaults/mainnet_STAGING';
import testnet from './environmentDefaults/testnet';
import testnet_STAGING from './environmentDefaults/testnet_STAGING';

const clearEmptyProps = <T>(config: T): T => Object.entries(config)
    .reduce<T>((cfg, [key, value]) => {
        if (typeof value !== 'undefined') {
            cfg[key] = value;
        }

        return cfg;
    }, {} as T);

const defaults = {
    [ENVIRONMENT.DEVELOPMENT]: development,
    [ENVIRONMENT.TESTNET]: testnet,
    [ENVIRONMENT.TESTNET_STAGING]: testnet_STAGING,
    [ENVIRONMENT.MAINNET]: mainnet,
    [ENVIRONMENT.MAINNET_STAGING]: mainnet_STAGING,
}[environmentConfig.NEAR_WALLET_ENV];

const CONFIG = {
    ...defaults,
    ...clearEmptyProps(environmentConfig),
};

export default CONFIG;
