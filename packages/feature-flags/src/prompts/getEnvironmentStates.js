const inquirer = require('inquirer');

module.exports = async function getEnvironmentStates({ environments, flagEntry }) {
    let choices = [];

    Object.values(environments)
        .forEach((name) => {
            choices.push({
                name,
                checked: (flagEntry && flagEntry[name] && !!flagEntry[name].enabled) || false
            });
        });

    const { flagStateByEnvironment } = await inquirer.prompt({
        name: 'flagStateByEnvironment',
        type: 'checkbox',
        message: 'Select the environments you want this flag enabled in',
        choices,
    });

    return flagStateByEnvironment;
}