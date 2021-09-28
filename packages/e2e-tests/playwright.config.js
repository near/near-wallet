require("dotenv").config();

const { devices, expect } = require("@playwright/test");
const { matchers } = require("expect-playwright");

expect.extend(matchers);

const config = {
    globalSetup: require.resolve("./global-setup.js"),
    reporter: [["list"], ["./pagerduty-reporter.js"]],
    timeout: 60000,
    use: {
        baseURL: process.env.WALLET_URL || "https://wallet.testnet.near.org",
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        storageState: {
            origins: [
                {
                    origin: process.env.WALLET_URL || "https://wallet.testnet.near.org",
                    localStorage: [{ name: "wallet.releaseNotesModal:v0.01.2:closed", value: "true" }],
                },
            ],
        },
    },
    projects: [
        {
            name: "Desktop Chromium",
            use: {
                browserName: "chromium"
            },
        },
        {
            name: "Desktop Firefox",
            use: {
                browserName: "firefox",
                viewport: { width: 800, height: 600 },
            },
        },
        {
            name: "Mobile Chrome",
            use: devices["Pixel 5"],
        },
        {
            name: "Desktop Safari",
            use: {
                browserName: "webkit",
                viewport: { width: 1200, height: 750 },
            },
        },
        {
            name: "Mobile Safari",
            use: devices["iPhone 12"],
        },
    ],
};

module.exports = config;
