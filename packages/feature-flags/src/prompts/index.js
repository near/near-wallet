const action = require('./action');
const enterNewFlagName = require('./enterNewFlagName');
const getEnvironmentStates = require('./getEnvironmentStates');
const selectEnvironmentForDeletion = require('./selectEnvironmentForDeletion');
const selectExistingFlag = require('./selectExistingFlag');
const setupNewEnvironment = require('./setupNewEnvironment');

module.exports = {
    action,
    enterNewFlagName,
    getEnvironmentStates,
    selectEnvironmentForDeletion,
    selectExistingFlag,
    setupNewEnvironment,
}