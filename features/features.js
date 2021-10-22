const { initFeatureFlags } = require('../packages/flag-editor');
const Environments = require('./environments.json');
const FeatureFlags = require('./flags.json');

module.exports = initFeatureFlags({
    flagState: FeatureFlags,
    currentEnvironment: process.env.ENVIRONMENT,
    environments: Environments,
});
