module.exports = {
    "moduleNameMapper": {
        "\\.(png|svg|pdf)": "<rootDir>/__mocks__/svgrMock.js",
        "\\.(css|scss)$": "<rootDir>/__mocks__/cssMock.js",
    },
    moduleDirectories: ["node_modules"],
    setupFilesAfterEnv: ["./jest.setup.js"],
    setupFiles: ["dotenv/config"],
};
