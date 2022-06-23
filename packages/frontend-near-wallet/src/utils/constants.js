export const VALIDATOR_VERSION = 'VALIDATOR';
export const FARMING_VALIDATOR_VERSION = 'FARMING_VALIDATOR';

export const ValidatorVersion = {
  [VALIDATOR_VERSION]: VALIDATOR_VERSION,
  [FARMING_VALIDATOR_VERSION]: FARMING_VALIDATOR_VERSION
};

export const MAINNET = 'mainnet';
export const TESTNET = 'testnet';
export const FARMING_VALIDATOR_PREFIXES_MAINNET = ['.pool.near'];
export const VALIDATOR_PREFIXES_MAINNET = ['.poolv1.near'];
export const FARMING_VALIDATOR_PREFIXES_TESTNET = ['.factory01.littlefarm.testnet','.factory.colorpalette.testnet'];
export const VALIDATOR_PREFIXES_TESTNET = ['.m0'];

export const FARMING_VALIDATOR_REGEXP_TESTNET = new RegExp(`.*(${FARMING_VALIDATOR_PREFIXES_TESTNET.join('|')}|${VALIDATOR_PREFIXES_TESTNET.join('|')})`);
export const FARMING_VALIDATOR_REGEXP_MAINNET = new RegExp(`.*(${FARMING_VALIDATOR_PREFIXES_MAINNET.join('|')}|${VALIDATOR_PREFIXES_MAINNET.join('|')})`);

export const getFarmingValidatorPrefixes = (networkId) => {
  switch (networkId) {
    case (MAINNET): {
      return FARMING_VALIDATOR_PREFIXES_MAINNET;
    }
    case (TESTNET): {
      return FARMING_VALIDATOR_PREFIXES_TESTNET;
    }
    default: {
      return FARMING_VALIDATOR_PREFIXES_TESTNET;
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
  const prefixes = getValidationNetworkPrefixes(networkId);
  return prefixes.some((prefix) => accountId.indexOf(prefix) !== -1) ? FARMING_VALIDATOR_VERSION : VALIDATOR_VERSION;
};

export const getValidationNetworkPrefixes = (networkId) => {
  switch (networkId) {
    case (MAINNET): {
      return FARMING_VALIDATOR_PREFIXES_MAINNET;
    }
    case (TESTNET): {
      return FARMING_VALIDATOR_PREFIXES_TESTNET;
    }
    default: {
      return FARMING_VALIDATOR_PREFIXES_TESTNET;
    }
  }
};
