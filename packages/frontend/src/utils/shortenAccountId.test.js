import { shortenAccountId } from './account';

describe('shortenAccountId', () => {
    test('should shorten account ID with correct format', () => {
        const sourceId = '4ee68bC02dd892aa1ad819101f3adf4cfafb90e3f73b827f4c2352b6efe363ek';

        expect(shortenAccountId(sourceId)).toBe('4ee68bC0...efe363ek');
        expect(shortenAccountId(sourceId, 7, 4)).toBe('4ee68bC...63ek');
        expect(shortenAccountId(sourceId, 13, 1)).toBe('4ee68bC02dd89...k');
        expect(shortenAccountId(sourceId, 30, 31)).toBe('4ee68bC02dd892aa1ad819101f3adf...afb90e3f73b827f4c2352b6efe363ek');
    });

    test('should not change account ID', () => {
        const sourceId = '4ee68bC02dd892aa1ad819101f3adf4cfafb90e3f73b827f4c2352b6efe363ek';
        const wrongId = 'abcde';

        expect(shortenAccountId(wrongId)).toBe(wrongId);
        expect(shortenAccountId(sourceId, 0, 8)).toBe(sourceId);
        expect(shortenAccountId(sourceId, 30, 32)).toBe(sourceId);
        expect(shortenAccountId(sourceId, 32, 30)).toBe(sourceId);
    });
});
