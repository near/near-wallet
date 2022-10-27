export type PasswordComplexity = 'none'|'week'|'average'|'strong';

export type Levels = 0|1|2|3;

export const getLevelsFromComplexity = (
    complexity: PasswordComplexity
): Levels => {
    switch (complexity) {
        case 'none':
            return 0;
        case 'week':
            return 1;
        case 'average':
            return 2;
        case 'strong':
            return 3;
    }
};

export const validatePassword = (
    value: string,
    minLength: number
): PasswordComplexity => {
    const regExpWeak = /[a-z]/;
    const regExpMedium = /\d+/;
    const regExpStrong = /.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/;

    if (!value) {
        return 'none';
    }

    const week = value.match(regExpWeak);
    const average = value.match(regExpMedium);
    const strong = value.match(regExpStrong);
    const inLength = value.length >= minLength;

    if (week && average && strong && inLength) {
        return 'strong';
    }

    if (((week && average) || (average && strong) || (week && strong)) && inLength) {
        return 'average';
    }

    if (week || average || strong) {
        return 'week';
    }

    return 'none';
};
