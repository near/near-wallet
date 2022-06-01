import fs from 'fs';
import path from 'path';

const TRANSLATION_BASE_PATH = path.resolve(__dirname, '../src/translations');

test('translations contain no unescaped links', () => {
    const translationPaths = fs.readdirSync(TRANSLATION_BASE_PATH)
        .filter((fileName) => fileName.endsWith('.json'))
        .map((fileName) => path.join(TRANSLATION_BASE_PATH, fileName));

    translationPaths.forEach((fileName) => {
        const translationLines = fs.readFileSync(fileName, 'utf-8').split('\n');
        translationLines.forEach((line) => {
            expect(line).toEqual(expect.not.stringMatching(/href=[^'"\\]/g));
        });
    });
});
