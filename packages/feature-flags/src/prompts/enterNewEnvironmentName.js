const inquirer = require('inquirer');

module.exports = async function newFlagName(existingEnvironments) {
    const { environmentName } = await inquirer.prompt({
        name: 'environmentName',
        type: 'input',
        message: 'Enter the name of the new environment',
        validate: (value) => {
            if (existingEnvironments.includes(value)) {
                throw new Error(`${value} already exists!`);
            }
            return true;
        }
    });

    const { sourceEnvironment } = await inquirer.prompt({
        name: 'sourceEnvironment',
        type: 'list',
        message: 'Select the environment from which to copy existing states',
        choices: existingEnvironments,
    });

    return { environmentName, sourceEnvironment };
};
