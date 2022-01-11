export const VALIDATOR_VERSION = "VALIDATOR";
export const PROJECT_VALIDATOR_VERSION = "PROJECT_VALIDATOR";

export const ValidatorVersion = {
  [VALIDATOR_VERSION]: VALIDATOR_VERSION,
  [PROJECT_VALIDATOR_VERSION]: PROJECT_VALIDATOR_VERSION
};

export const MAINNET = "mainnet";
export const TESTNET = "testnet";
export const PROJECT_VALIDATOR_PREFIX_MAINNET = ".near";
export const VALIDATOR_PREFIX_MAINNET = ".pool.near";
export const PROJECT_VALIDATOR_PREFIX_TESTNET = "staked.pool.f863973.m0";
export const VALIDATOR_PREFIX_TESTNET = ".m0";

export const PROJECT_VALIDATOR_REGEXP_TESTNET = new RegExp(`.*(${PROJECT_VALIDATOR_PREFIX_TESTNET}|${VALIDATOR_PREFIX_TESTNET})`);
export const PROJECT_VALIDATOR_REGEXP_MAINNET = new RegExp(`.*(${PROJECT_VALIDATOR_PREFIX_MAINNET}|${VALIDATOR_PREFIX_MAINNET})`);

export const getValidatorRegExp = (networkId) => {
  switch (networkId) {
    case (MAINNET): {
      return PROJECT_VALIDATOR_REGEXP_MAINNET;
    }
    case (TESTNET): {
      return PROJECT_VALIDATOR_REGEXP_TESTNET;
    }
    default: {
      return PROJECT_VALIDATOR_PREFIX_TESTNET;
    }
  }
};

export const getValidationVersion = (networkId, accountId) => {
  const prefix = getValidationNetworkPrefix(networkId);
  return accountId.indexOf(prefix) === -1 ? VALIDATOR_VERSION : PROJECT_VALIDATOR_VERSION;
};

export const getValidationNetworkPrefix = (networkId) => {
  switch (networkId) {
    case (MAINNET): {
      return PROJECT_VALIDATOR_PREFIX_MAINNET;
    }
    case (TESTNET): {
      return PROJECT_VALIDATOR_PREFIX_TESTNET;
    }
    default: {
      return PROJECT_VALIDATOR_PREFIX_TESTNET;
    }
  }
};
