module.exports = {
    setupFilesAfterEnv: ['./jest.setup.js'],
    setupFiles: ['dotenv/config'],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^.+\\.svg$': 'jest-svg-transformer'
    }
};
