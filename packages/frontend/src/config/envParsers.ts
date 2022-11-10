export const envValIsSet = (envVal: string|any): boolean =>
    typeof envVal === 'string';

export const parseBooleanFromShell = (envVal: string|any): boolean|undefined =>
    envValIsSet(envVal) ? envVal === 'yes' || envVal === 'true' : undefined;

export const parseObjectFromShell = (
    envVal: Object|any
): Record<any, any>|undefined => {
    try {
        return JSON.parse(envVal);
    } catch (error) {
        return undefined;
    }
};

export const parseCommaSeperatedStringAsArrayFromShell = (
    envVal: string|any
): string[]|undefined =>
    envValIsSet(envVal) ? envVal.split(',') : undefined;
