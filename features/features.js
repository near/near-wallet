const { initFeatureFlags } = require('@near-wallet/feature-flags');
const { NEAR_WALLET_ENV } = require('../packages/frontend/ci/config')
const Environments = require('./environments.json');
const FeatureFlags = require('./flags.json');

const Features = initFeatureFlags({
    flagState: FeatureFlags,
    currentEnvironment: NEAR_WALLET_ENV,
    environments: Environments,
});

module.exports = { Features };
