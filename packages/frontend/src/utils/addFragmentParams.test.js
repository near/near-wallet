import { addFragmentParams } from './addFragmentParams';

describe('addFragmentParams', () => {
    test('should pass multiple params to the url hash', () => {
        const baseUrl = 'https://mynearwallet.com';
        const params = { key1: 'value1', key2: 'value2' };
        expect(addFragmentParams(baseUrl, params)).toBe(
            'https://mynearwallet.com/#key1=value1&key2=value2'
        );
    });
    test('should pass params with integer values to the url hash', () => {
        const baseUrl = 'https://mynearwallet.com';
        const params = { key1: 1, key2: 2 };
        expect(addFragmentParams(baseUrl, params)).toBe(
            'https://mynearwallet.com/#key1=1&key2=2'
        );
    });
    test('should pass params with zero value to the url hash', () => {
        const baseUrl = 'https://mynearwallet.com';
        const params = { key: 0 };
        expect(addFragmentParams(baseUrl, params)).toBe(
            'https://mynearwallet.com/#key=0'
        );
    });
    test('should pass params with false value to the url hash', () => {
        const baseUrl = 'https://mynearwallet.com';
        const params = { key: false };
        expect(addFragmentParams(baseUrl, params)).toBe(
            'https://mynearwallet.com/#key=false'
        );
    });
    test('should filter params with undefined value', () => {
        const baseUrl = 'https://mynearwallet.com';
        const params = { key: undefined };
        expect(addFragmentParams(baseUrl, params)).toBe('https://mynearwallet.com/');
    });
    test('should filter params with null value', () => {
        const baseUrl = 'https://mynearwallet.com';
        const params = { key: null };
        expect(addFragmentParams(baseUrl, params)).toBe('https://mynearwallet.com/');
    });
});
