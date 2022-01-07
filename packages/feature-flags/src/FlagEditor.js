const fsx = require('fs-extra');
const path = require('path');

const getGitUsername = require('./gitTools/git-user-name');

const { ACTIONS } = require('./constants');

const CONFIG_DIRECTORY = 'features';
const FLAGS_FILENAME = 'flags.json';
const FEATURES_TYPEDEF_FILENAME = 'features.d.ts';
const ENVIRONMENTS_FILENAME = 'environments.json';
const ENABLE_DEBUG_LOGGING = process.env.NEAR_FLAG_DEBUG === 'true' || false;

class FlagEditor {
    constructor({ prompts }) {
        this.prompts = prompts;
        this._configPath = null;
        this._environments = null;
        this._flagsFilepath = null;
        this._flagsState = null;
    }

    log(...args) {
        ENABLE_DEBUG_LOGGING && console.log(...args);
    }

    async init() {
        const userEditing = await getGitUsername();
        this.log({ userEditing });

        await this.loadContext();
        await this.loadFlags(this._flagsFilepath);

        const flagNames = Object.keys(this._flagsState);

        const action = await this.prompts.action(flagNames.length !== 0);
        this.log({ action })

        switch (action) {
            case ACTIONS.ADD_FLAG: {
                const flagName = await this.prompts.enterNewFlagName(flagNames);
                await this.setFlagState(flagName, userEditing);
                break;
            }
            case ACTIONS.EDIT_FLAG: {
                const flagName = await this.prompts.selectExistingFlag(flagNames);
                await this.setFlagState(flagName, userEditing);
                break;
            }
            case ACTIONS.REMOVE_FLAG: {
                const flagName = await this.prompts.selectExistingFlag(flagNames);
                delete this._flagsState[flagName];
                break;
            }
            case ACTIONS.ADD_ENVIRONMENT: {
                const {
                    environmentName,
                    sourceEnvironment,
                } = await this.prompts.enterNewEnvironmentName(Object.values(this._environments));
                await this.addEnvironment({ environmentName, sourceEnvironment });
                break;
            }
            case ACTIONS.REMOVE_ENVIRONMENT: {
                const environmentName = await this.prompts.selectExistingEnvironment(Object.values(this._environments));
                await this.removeEnvironment(environmentName);
                break;
            }
        }

        await this.saveFlags();
        await this.writeTypeDefinitions();
    }

    async setFlagState(flagName, userEditing) {
        const flagEntry = this._flagsState[flagName];
        const environmentsEnabledIn = await this.prompts.getEnvironmentStates({
            environments: this._environments,
            flagEntry
        });

        this._flagsState = {
            ...this._flagsState,
            [flagName]: this.flagEntry({ environmentsEnabledIn, flagEntry, userEditing })
        }
    }

    flagEntry({ environmentsEnabledIn, flagEntry, userEditing }) {
        this.log({ userEditing });

        const perEnvEntries = {};
        Object.values(this._environments).forEach((name) => {
            const perEnvEntry = (flagEntry && flagEntry[name]) || {};

            const enabled = environmentsEnabledIn.includes(name);
            let isEditing = (enabled !== perEnvEntry.enabled);

            perEnvEntries[name] = {
                ...perEnvEntry,
                enabled,
                lastEditedBy: !isEditing ? perEnvEntry.lastEditedBy : userEditing,
                lastEditedAt: !isEditing ? perEnvEntry.lastEditedAt : new Date().toISOString(),
            }
        })

        return {
            createdBy: flagEntry ? flagEntry.createdBy : userEditing,
            createdAt: flagEntry ? flagEntry.createdAt : new Date().toISOString(),
            ...perEnvEntries,
        }
    }

    async addEnvironment({ environmentName, sourceEnvironment }) {
        this._environments = {
            ...this._environments,
            [environmentName.toUpperCase()]: environmentName,
        };

        const configPath = await this.resolveConfigPath();
        await fsx.writeJson(path.join(configPath, ENVIRONMENTS_FILENAME), this._environments, { spaces: 2 });

        Object.entries(this._flagsState).forEach(([flagName, flagState]) => {
            this._flagsState[flagName][environmentName] = flagState[sourceEnvironment];
        });
    }

    async removeEnvironment(environmentName) {
        delete this._environments[environmentName.toUpperCase()];

        const configPath = await this.resolveConfigPath();
        await fsx.writeJson(path.join(configPath, ENVIRONMENTS_FILENAME), this._environments, { spaces: 2 });

        Object.keys(this._flagsState).forEach((flagName) => {
            delete this._flagsState[flagName][environmentName];
        });
    }

    async resolveConfigPath() {
        if (this._configPath) {
            return this._configPath;
        }

        const { base, dir, root } = path.parse(process.cwd());
        let fileFound = false;
        let currPath = path.join(dir, base);

        while (!fileFound && currPath && currPath !== root) {
            fileFound = await fsx.exists(path.join(currPath, CONFIG_DIRECTORY, FLAGS_FILENAME));

            if (!fileFound) {
                currPath = currPath
                    .split(path.sep)
                    .slice(0, -1)
                    .join(path.sep);
            }
        }

        if (!fileFound) {
            throw new Error(`Could not find a ${FLAGS_FILENAME} in CWD or any parent dir. Run this tool from a NEAR repo!`)
        }

        this._configPath = path.join(currPath, CONFIG_DIRECTORY);
        return this._configPath;
    }

    async loadContext() {
        const configPath = await this.resolveConfigPath();
        this._flagsFilepath = path.join(configPath, FLAGS_FILENAME);
        this._environments = await fsx.readJson(path.join(configPath, ENVIRONMENTS_FILENAME));
    }

    async loadFlags() {
        try {
            this._flagsState = await fsx.readJson(this._flagsFilepath)
        } catch (e) {
            console.log(e);
            throw new Error(`Failed to load JSON from ${this._flagsFilepath}. Probably not valid JSON!`)
        }
    }

    async saveFlags() {
        this.log("writing file", { filepath: this._flagsFilepath, state: this._flagsState });

        const flagOutput = Object.keys(this._flagsState)
            .sort()
            .reduce((flagsState, flagName) => {
                flagsState[flagName] = this._flagsState[flagName];
                return flagsState;
            }, {});

        return fsx.writeJson(this._flagsFilepath, flagOutput, { spaces: 2 });
    }

    async writeTypeDefinitions() {
        const typeDefPath = this._flagsFilepath.replace(FLAGS_FILENAME, FEATURES_TYPEDEF_FILENAME);

        const alphabetizedTypeDefs = Object.keys(this._flagsState)
            .sort()
            .map((flag) => `${flag}: boolean;`)
            .join('\n\t');

        const fileContent = `
/* This file is generated by the flag editor util. Changes will be lost! */

export type Features = {
    ${alphabetizedTypeDefs}
};
`;

        this.log("writing typedef file", { filepath: this._flagsFilepath, state: this._flagsState });
        return fsx.writeFile(typeDefPath, fileContent);
    }
}

module.exports = FlagEditor;
