import Environments from '../../../features/environments.json';
import Flags from '../../../features/flags.json';

const nonEnvironmentKeys = [
    'createdAt',
    'createdBy',
];

function formatEnvironments(environments) {
    return environments.sort().join(',');
}

test('all feature flags specify all environments', () => {
    const allEnvironments = Object.values(Environments);
    Object.entries(Flags).forEach(([flag, flagEnvironments]) => {
        const specifiedEnvironments = Object.keys(flagEnvironments)
            .filter((env) => !nonEnvironmentKeys.includes(env));

        const actual = `${flag}:${formatEnvironments(specifiedEnvironments)}`;
        const expected = `${flag}:${formatEnvironments(allEnvironments)}`;

        expect(actual).toBe(expected);
    });
});
