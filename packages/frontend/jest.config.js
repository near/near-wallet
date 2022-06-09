module.exports = {
    setupFilesAfterEnv: ['./jest.setup.js'],
    setupFiles: ['dotenv/config'],
    testEnvironment: 'jsdom'
};
