# NEAR Wallet Feature Flags

This package enables the use of feature flags across NEAR Wallet. These feature flags serve as code guards around
functionality being implemented, enabling developers to iterate on more complex features while still being able to
deploy small changes. Feature flags are enabled per environment, allowing finer granularity on how the functionality
is rolled out.

Getting started
===

Modifying feature flags requires the use of the `flag` binary, installed by running:

`yarn binstall`

This creates the `flag` binary under `/usr/local/bin/flag`. Running the binary prompts the user for the intended action,
currently one of:
- Creating a new feature flag and setting the environments in which it should be enabled.
- Modifying an existing feature flag to be enabled or disabled in the desired environments.
- Deleting an existing feature flag.

Running the `flag` binary requires a `features/` directory along the current path, the closest of which will be used
by the binary. `flag` is responsible for both generating and modifying the files in this directory, so it is crucial
that no changes are made to this directory's contents outside the `flag` binary once configured.

Using Feature Flags
===

In order to use this package, a `features/` directory must be created at the appropriate level (e.g. the project root) with
the following files:
- `environments.json`: The valid environments for the application, in the form of `"ENV_NAME": "env_value"`.
- `flags.json`: The set of flags enabled per environment. During initial configuration this should be an empty JSON file.
- `features.js`: Module responsible for initializing and exporting the feature flags for use in the target project.

The `features.js` module is responsible for initializing the proxy object via the `initFeatureFlags` method exported from
this package. This method requires three parameters:
- `currentEnvironment`: The environment against which flags should be validated. The provided value must be a valid value in `environments.json` or an exception will be thrown.
- `environments`: The set of valid environments, specified in `environments.json`. 
- `flagState`: The set of defined feature flags, specified in `flags.json`.

Once configured, the proxy object returned from `initFeatureFlags` is used to check the state of a feature by referring to
the flag name, e.g. `const isFeatureXEnabled = Features.FEATURE_X`. The proxy object will throw an exception if the
flag does not exist.

Examples
===

The following outlines initial example templates for the required files mentioned above. This code is required to correctly
set up the `Features` proxy object for use in a project.

#### features/environments.json
```json
{
  "TESTNET": "testnet",
  "MAINNET": "mainnet"
}
```

#### features/flags.json
```json
{}
```

#### features/features.js
```js
const { initFeatureFlags } = require('@near-wallet/feature-flags');

const Environments = require('./environments.json');
const Flags = require('./environments.json');

const Features = initFeatureFlags({
    currentEnvironment: process.env.NEAR_WALLET_ENV, // this can be any environment-derived value so long as it matches a value from environments.json
    environments: Environments,
    flagState: Flags,
});

module.exports = {
    Features,
};
```
