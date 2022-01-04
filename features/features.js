const { initFeatureFlags } = require('@near-wallet/feature-flags');
const Environments = require('./environments.json');
const FeatureFlags = require('./flags.json');

const Features = initFeatureFlags({
    flagState: FeatureFlags,
    currentEnvironment: process.env.NEAR_WALLET_ENV,
    environments: Environments,
});

module.exports = { Features };
