const { isTokenIncluded } = require('../src/hooks/useTokenBlacklist');

describe('Fungible Token Blacklist', () => {
    test('non-blacklisted tokens are included', () => {
        expect(isTokenIncluded('test.near', ['not.near'])).toBe(true);
    });

    test('explicitly blacklisted tokens are excluded', () => {
        expect(isTokenIncluded('test.near', ['test.near'])).toBe(false);
    });

    test('wildcard-prefixed blacklisted tokens are excluded', () => {
        expect(isTokenIncluded('mal.test.near', ['*.test.near'])).toBe(false);
        expect(isTokenIncluded('mal.test.near', ['xyz.near', '*.test.near'])).toBe(false);
    });

    test('non-matching tokens are included despite wildcard-prefixed blacklisted tokens', () => {
        expect(isTokenIncluded('test.near', ['*.test.near'])).toBe(true);
        expect(isTokenIncluded('xyz.near', ['*.test.near'])).toBe(true);
        expect(isTokenIncluded('xyz.near', ['*.test.near', 'abc.near'])).toBe(true);
    });
});
