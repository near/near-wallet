const { test, expect } = require("@playwright/test");
const { HomePage } = require("../register/models/Home");

const { createRandomBankSubAccount } = require("../utils/account");
const { LoginPage } = require("./models/Login");

const { describe, beforeAll, afterAll, beforeEach } = test;

describe("Login with Dapp", () => {
    let testAccount;

    beforeAll(async () => {
        testAccount = await createRandomBankSubAccount();
    });

    beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(
            testAccount.account.accountId,
            testAccount.seedPhrase
        );
    });

    afterAll(async () => {
        testAccount && (await testAccount.delete());
    });

    test("navigates to login with dapp page", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const testDappUrl = `https://near.org`;
        await loginPage.navigate(testDappUrl);

        await expect(page).toMatchURL(/\/login/);
        const { hostname: testDappHostname } = new URL(testDappUrl);
        await expect(page).toMatchText(
            `data-test-id=requestingAppTitleDisplay`,
            testDappHostname
        );
        const currentlyLoggedInUser = await page.textContent(
            "data-test-id=currentUser"
        );
        await expect(page).not.toHaveSelector(".dots");
        await expect(page).toMatchText(
            "data-test-id=dropdownCurrentlySelectedAccount",
            currentlyLoggedInUser
        );
    });
    test("navigates back to dapp with access key when access is granted", async ({
        page,
    }) => {
        const loginPage = new LoginPage(page);
        const testDappUrl = `https://near.org`;
        await loginPage.navigate(testDappUrl);

        await loginPage.allowAccess();
        await page.waitForNavigation();

        await expect(page).toMatchURL(new RegExp(testDappUrl));

        await loginPage.initializeNearWalletConnection();
        const localStorageKeys = await page.evaluate(() =>
            Object.keys(window.localStorage)
        );
        const pendingkeyLocalStorageKey = localStorageKeys.find((k) =>
            /pending_key/.test(k)
        );
        const accesskeyLocalStorageKey = localStorageKeys.find((k) =>
            new RegExp(testAccount.account.accountId).test(k)
        );
        await expect(pendingkeyLocalStorageKey).toBeFalsy();
        await expect(accesskeyLocalStorageKey).toBeTruthy();
    });
    test("navigates back to dapp when access is denied", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const testDappUrl = `https://near.org`;
        await loginPage.navigate(testDappUrl);

        await loginPage.denyAccess();

        await expect(page).toMatchURL(new RegExp(testDappUrl));

        await loginPage.initializeNearWalletConnection();
        const localStorageKeys = await page.evaluate(() =>
            Object.keys(window.localStorage)
        );
        const pendingkeyLocalStorageKey = localStorageKeys.find((k) =>
            /pending_key/.test(k)
        );
        const accesskeyLocalStorageKey = localStorageKeys.find((k) =>
            new RegExp(testAccount.account.accountId).test(k)
        );
        await expect(pendingkeyLocalStorageKey).toBeTruthy();
        await expect(accesskeyLocalStorageKey).toBeFalsy();
    });
});
