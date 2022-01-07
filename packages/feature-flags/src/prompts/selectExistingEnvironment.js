const inquirer = require('inquirer');

module.exports = async function selectExistingEnvironment(environments) {
    const { environmentName } = await inquirer.prompt({
        type: 'list',
        name: 'environmentName',
        message: 'Select the environment you wish to modify',
        choices: environments,
    })

    return environmentName;
}