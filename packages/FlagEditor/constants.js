const ACTIONS = {
    ADD_FLAG: 'add',
    REMOVE_FLAG: 'delete',
    EDIT_FLAG: 'edit'
}

// TODO: Load from `near-api-js` config or similar?
const ENVIRONMENTS = {
    DEVELOPMENT: 'development',
    TESTNET: 'testnet',
    TESTNET_STAGING: 'testnet_STAGING',
    MAINNET: 'mainnet',
    MAINNET_STAGING: 'mainnet_STAGING'
}

module.exports = {
    ACTIONS,
    ENVIRONMENTS
}