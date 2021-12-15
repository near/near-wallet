export const envValIsSet = (envVal) => typeof envVal === "string";

export const parseBooleanFromShell = (envVal) =>
    envValIsSet(envVal) ? envVal === "yes" || envVal === "true" : undefined;

export const parseObjectFromShell = (envVal) => {
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

export const parseCommaSeperatedStringAsArrayFromShell = (envVal) =>
    envValIsSet(envVal) ? envVal.split(",") : undefined;
