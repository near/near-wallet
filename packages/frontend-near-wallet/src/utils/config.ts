import Environments from '../../../../features/environments.json';

export const NEAR_WALLET_ENV = process.env.NEAR_WALLET_ENV || Environments.DEVELOPMENT;
export const NETWORK_ID =  process.env.REACT_APP_NETWORK_ID  || 'default';

