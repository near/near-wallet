const envValIsSet = (envVal) => typeof envVal === "string";

const parseBooleanFromShell = (envVal) =>
    envValIsSet(envVal) ? envVal === "yes" || envVal === "true" : undefined;

const parseObjectFromShell = (envVal) => {
    try {
        return JSON.parse(envVal);
    } catch (error) {
        return undefined;
    }
};

const parseCommaSeperatedStringAsArrayFromShell = (envVal) =>
    envValIsSet(envVal) ? envVal.split(",") : undefined;

module.exports = {
    envValIsSet,
    parseBooleanFromShell,
    parseObjectFromShell,
    parseCommaSeperatedStringAsArrayFromShell,
};
