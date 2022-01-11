module.exports = {
    "moduleNameMapper": {
        "\\.(png|svg|pdf)": "<rootDir>/__mocks__/svgrMock.js",
        "\\Container.css": "<rootDir>/__mocks__/containerMock.js",
        "\\Card.css": "<rootDir>/__mocks__/containerMock.js",
        "\\.(css|scss)$": "<rootDir>/__mocks__/cssMock.js",
    },
    moduleDirectories: ["./packages/frontend/node_modules"],
    setupFilesAfterEnv: ["./jest.setup.js"],
    setupFiles: ["dotenv/config"],
};
