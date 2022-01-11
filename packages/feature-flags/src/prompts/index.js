const action = require('./action');
const enterNewEnvironmentName = require('./enterNewEnvironmentName');
const enterNewFlagName = require('./enterNewFlagName');
const getEnvironmentStates = require('./getEnvironmentStates');
const selectEnvironmentForDeletion = require('./selectEnvironmentForDeletion');
const selectExistingFlag = require('./selectExistingFlag');

module.exports = {
    action,
    enterNewEnvironmentName,
    enterNewFlagName,
    getEnvironmentStates,
    selectEnvironmentForDeletion,
    selectExistingFlag,
}