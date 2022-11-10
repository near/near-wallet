type Handler<T> = (value: T) => void;

type Target<T> = {
    target: T;
    currentTarget: T;
}

type ValueEvent = {
    value: string;
}

type CheckedEvent = {
    checked: boolean
}

type Evt<T> = (evt: Target<ValueEvent>) => T;

export function targetValue(handler: Handler<string>): Evt<string>;
export function targetValue(handler: Handler<number>, radix: number): Evt<number>;
export function targetValue(handler: Handler<any>, radix?: number): Evt<any> {
    return (evt) => {
        const value = evt.target.value;

        return handler(radix ? parseInt(value, radix) : value);
    };
}

export function currentTargetValue(handler: Handler<string>): Evt<string>;
export function currentTargetValue(handler: Handler<number>, radix: number): Evt<number>;
export function currentTargetValue(handler: Handler<any>, radix?: number): Evt<any> {
    return (evt) => {
        const value = evt.currentTarget.value;

        return handler(radix ? parseInt(value, radix) : value);
    };
}

export const currentTargetChecked = (handler: Handler<boolean>) =>
    (evt: Target<CheckedEvent>) => handler(evt.currentTarget.checked);
