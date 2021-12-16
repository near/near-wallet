const envValIsSet = (envVal) => typeof envVal === "string";

const parseBooleanFromShell = (envVal) =>
    envValIsSet(envVal) ? envVal === "yes" || envVal === "true" : undefined;

const parseObjectFromShell = (envVal) => {
    if (envValIsSet(envVal)) {
        try {
            let parsed = JSON.parse(envVal);
            return parsed;
        } catch (error) {
            return undefined;
        }
    }
    return undefined;
};

const parseCommaSeperatedStringAsArrayFromShell = (envVal) =>
    envValIsSet(envVal) ? envVal.split(",") : undefined;

module.exports = {
    envValIsSet,
    parseBooleanFromShell,
    parseObjectFromShell,
    parseCommaSeperatedStringAsArrayFromShell,
};
