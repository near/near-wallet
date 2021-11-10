const { test, expect } = require("@playwright/test");

const { HomePage } = require("../register/models/Home");
const { getBankAccount } = require("../utils/account");
const { testDappURL } = require("../utils/config");
const { LoginPage } = require("./models/Login");

const { describe, beforeAll, afterAll, beforeEach } = test;

describe("Login with Dapp", () => {
    let testAccount;

    beforeAll(async () => {
        const bankAccount = await getBankAccount();
        testAccount = bankAccount.spawnRandomSubAccountInstance();
        await testAccount.create();
    });

    beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(
            testAccount.accountId,
            testAccount.seedPhrase
        );
    });

    afterAll(async () => {
        await testAccount.delete();
    });

    test("navigates to login with dapp page", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();

        await expect(page).toMatchURL(/\/login/);

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
        const testDappPage = await loginPage.navigate();

        await loginPage.allowAccess();

        await expect(page).toMatchURL(new RegExp(testDappURL));

        const pendingkeyLocalStorageKeys =
            await testDappPage.getPendingAccessKeys();
        await expect(pendingkeyLocalStorageKeys).toHaveLength(0);

        const accesskeyLocalStorageKey =
            await testDappPage.getAccessKeyForAccountId(
                testAccount.accountId
            );
        await expect(accesskeyLocalStorageKey).toBeTruthy();

        await expect(page).toMatchText(
            "data-test-id=testDapp-currentUser",
            new RegExp(testAccount.accountId)
        );
    });
    test("navigates back to dapp when access is denied", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const testDappPage = await loginPage.navigate();

        await loginPage.denyAccess();

        await expect(page).toMatchURL(new RegExp(testDappURL));

        const pendingkeyLocalStorageKeys =
            await testDappPage.getPendingAccessKeys();
        await expect(pendingkeyLocalStorageKeys).not.toHaveLength(0);

        const accesskeyLocalStorageKey =
            await testDappPage.getAccessKeyForAccountId(
                testAccount.accountId
            );
        await expect(accesskeyLocalStorageKey).toBeFalsy();

        await expect(page).toHaveSelector("data-test-id=testDapp-signInBtn");
    });
});
