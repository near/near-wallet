export const VALIDATOR_VERSION = "VALIDATOR";
export const FARMING_VALIDATOR_VERSION = "FARMING_VALIDATOR";

export const ValidatorVersion = {
  [VALIDATOR_VERSION]: VALIDATOR_VERSION,
  [FARMING_VALIDATOR_VERSION]: FARMING_VALIDATOR_VERSION
};

export const MAINNET = "mainnet";
export const TESTNET = "testnet";
export const FARMING_VALIDATOR_PREFIX_MAINNET = ".pool.near";
export const VALIDATOR_PREFIX_MAINNET = ".poolv1.near";
export const FARMING_VALIDATOR_PREFIX_TESTNET = ".factory01.littlefarm.testnet";
export const VALIDATOR_PREFIX_TESTNET = ".m0";

export const FARMING_VALIDATOR_REGEXP_TESTNET = new RegExp(`.*(${FARMING_VALIDATOR_PREFIX_TESTNET}|${VALIDATOR_PREFIX_TESTNET})`);
export const FARMING_VALIDATOR_REGEXP_MAINNET = new RegExp(`.*(${FARMING_VALIDATOR_PREFIX_MAINNET}|${VALIDATOR_PREFIX_MAINNET})`);

export const getFarmingValidatorPrefix = (networkId) => {
  switch (networkId) {
    case (MAINNET): {
      return FARMING_VALIDATOR_PREFIX_MAINNET;
    }
    case (TESTNET): {
      return FARMING_VALIDATOR_PREFIX_TESTNET;
    }
    default: {
      return FARMING_VALIDATOR_PREFIX_TESTNET;
    }
  }
};

export const getValidatorRegExp = (networkId) => {
  switch (networkId) {
    case (MAINNET): {
      return FARMING_VALIDATOR_REGEXP_MAINNET;
    }
    case (TESTNET): {
      return FARMING_VALIDATOR_REGEXP_TESTNET;
    }
    default: {
      return FARMING_VALIDATOR_REGEXP_TESTNET;
    }
  }
};

export const getValidationVersion = (networkId, accountId) => {
  const prefix = getValidationNetworkPrefix(networkId);
  return accountId.indexOf(prefix) === -1 ? VALIDATOR_VERSION : FARMING_VALIDATOR_VERSION;
};

export const getValidationNetworkPrefix = (networkId) => {
  switch (networkId) {
    case (MAINNET): {
      return FARMING_VALIDATOR_PREFIX_MAINNET;
    }
    case (TESTNET): {
      return FARMING_VALIDATOR_PREFIX_TESTNET;
    }
    default: {
      return FARMING_VALIDATOR_PREFIX_TESTNET;
    }
  }
};
