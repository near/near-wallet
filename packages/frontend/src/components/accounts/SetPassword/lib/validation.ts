export const MIN_PASS_LEN = 8;

export const inLength = (value: string): boolean => value.length >= MIN_PASS_LEN;

export const isEqual = (a: string, b: string): boolean => a === b;
