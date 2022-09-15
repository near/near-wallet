import { isEmptyError } from './isEmptyError';

describe('shortenAccountId', () => {
    test('should return true on falsy values', () => {
        expect(isEmptyError(null)).toBe(true);
        expect(isEmptyError(undefined)).toBe(true);
        expect(isEmptyError('')).toBe(true);
    });

    test('should return false when error is passed', () => {
        expect(isEmptyError({})).toBe(true);
        expect(isEmptyError({ message: 'error' })).toBe(false);
        expect(isEmptyError({ code: 'error' })).toBe(false);
        expect(isEmptyError({ message: 'error', code: 'error' })).toBe(false);
    });

    test('should return true when empty object is passed', () => {
        expect(isEmptyError({})).toBe(true);
    });

    test('should return true when empty error is passed', () => {
        expect(isEmptyError({ message: '', code: '' })).toBe(true);
        expect(isEmptyError({ message: null, code: null })).toBe(true);
        expect(isEmptyError({ message: undefined, code: undefined })).toBe(true);
    });
});
