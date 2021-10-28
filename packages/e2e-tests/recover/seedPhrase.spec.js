const { test, expect } = require("../playwrightWithFixtures");

const { describe, beforeAll, afterAll } = test;

describe("Account Recovery Using Seed Phrase", () => {
    let testAccount;

    beforeAll(async ({ bankAccount }) => {
        testAccount = bankAccount.spawnRandomSubAccountInstance();
        await testAccount.create();
    });

    afterAll(async () => {
        testAccount && (await testAccount.delete());
    });

    test("navigates to seed phrase page successfully", async ({ page }) => {
        await page.goto("/");

        await page.click(`data-test-id=homePageImportAccountButton`);
        await page.click(`data-test-id=recoverAccountWithPassphraseButton`);

        await expect(page).toMatchURL(/\/recover-seed-phrase$/);
    });

    test("recovers account using seed phrase", async ({ page }) => {
        await page.goto("/recover-seed-phrase");

        await page.fill(
            "data-test-id=seedPhraseRecoveryInput",
            testAccount.seedPhrase
        );
        await page.click(`data-test-id=seedPhraseRecoverySubmitButton`);

        await page.waitForNavigation();

        await expect(page).toMatchURL(/\/$/);
        await expect(page).toMatchText(
            "data-test-id=currentUser >> visible=true",
            testAccount.accountId
        );
    });
});
