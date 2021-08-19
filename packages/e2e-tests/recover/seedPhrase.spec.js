const { test, expect } = require("@playwright/test");

const { createRandomBankSubAccount } = require("../utils/account");

const { describe, beforeAll, afterAll } = test;

describe("Account Recovery Using Seed Phrase", () => {
    let testAccount;

    beforeAll(async () => {
        testAccount = await createRandomBankSubAccount();
    });

    afterAll(async () => {
        testAccount && (await testAccount.delete());
    });

    test("navigates to seed phrase page successfully", async ({ page }) => {
        await page.goto("/");

        await page.click(`button:text-matches("Import Existing Account", "i")`);
        await page.click(`data-test-id=recoverAccountWithPassphraseButton`);

        await expect(page).toMatchURL(/\/recover-seed-phrase$/);
    });

    test("recovers account using seed phrase", async ({ page }) => {
        await page.goto("/recover-seed-phrase");

        await page.fill(
            "data-test-id=seedPhraseRecoveryInput",
            testAccount.seedPhrase
        );
        await page.click(`[type="submit"]`);

        await page.waitForNavigation();

        await expect(page).toMatchURL(/\/$/);
        await expect(page).toMatchText(
            "data-test-id=currentUser >> visible=true",
            testAccount.account.accountId
        );
    });
});
