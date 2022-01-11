const inquirer = require('inquirer');

module.exports = async function selectExistingEnvironment(environments) {
    const { proceed } = await inquirer.prompt({
        type: 'confirm',
        name: 'proceed',
        message: `
💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥
Removing existing environments WILL break any production environments using this configuration.
Only proceed if the target environment is no longer active.

Continue?
💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥
`,
    });

    if (!proceed) {
        return null;
    }

    const { environmentName } = await inquirer.prompt({
        type: 'list',
        name: 'environmentName',
        message: 'Select the environment you wish to modify',
        choices: environments,
    })

    return environmentName;
}