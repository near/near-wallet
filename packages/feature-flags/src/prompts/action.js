const inquirer = require('inquirer');
const { ACTIONS } = require('../constants');

module.exports = async function actionPrompt(hasFlags) {
    const { action } = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What do you want to do?',
        choices: hasFlags ? [ACTIONS.ADD_FLAG, ACTIONS.EDIT_FLAG, ACTIONS.REMOVE_FLAG, ACTIONS.ADD_ENVIRONMENT] : [ACTIONS.ADD_FLAG, ACTIONS.ADD_ENVIRONMENT],
        default: hasFlags ? ACTIONS.EDIT_FLAG : ACTIONS.ADD_FLAG,
    });

    return action;
}