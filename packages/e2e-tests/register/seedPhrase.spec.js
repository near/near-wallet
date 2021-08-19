const { test, expect } = require("@playwright/test");

const {
    generateTestAccountId,
    connectToAccountWithSeedphrase,
} = require("../utils/account");
const { HomePage } = require("./models/Home");
const { CreateAccountPage } = require("./models/CreateAccount");
const { SetRecoveryOptionPage } = require("./models/SetRecoveryOption");

const { describe, afterAll } = test;

describe("Account Registration Using Seed Phrase", () => {
    const testAccountId = generateTestAccountId();
    let testAccountInstance;

    afterAll(async () => {
        testAccountInstance &&
            (await testAccountInstance.deleteAccount("testnet"));
    });

    test("navigates to set account recovery page successfuly", async ({
        page,
    }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();

        await homePage.clickCreateAccount();
        expect(page).toMatchURL(/\/create$/);

        const createAccountPage = new CreateAccountPage(page);
        await createAccountPage.acceptTerms();
        await createAccountPage.submitAccountId(testAccountId);
        expect(page).toMatchURL(new RegExp(`/set-recovery/${testAccountId}`));
    });
    test("is able to select other recovery methods and navigate to phrase setup", async ({
        page,
    }) => {
        const setRecoveryOptionPage = new SetRecoveryOptionPage(page);
        await setRecoveryOptionPage.navigate(testAccountId);

        await setRecoveryOptionPage.clickLedgerRecoveryOption();
        await expect(page).toMatchAttribute(
            setRecoveryOptionPage.getLedgerSelector(),
            "class",
            /active/
        );

        await setRecoveryOptionPage.clickEmailRecoveryOption();
        await expect(page).toMatchAttribute(
            setRecoveryOptionPage.getEmailSelector(),
            "class",
            /active/
        );

        await setRecoveryOptionPage.clickPhoneRecoveryOption();
        await expect(page).toMatchAttribute(
            setRecoveryOptionPage.getPhoneSelector(),
            "class",
            /active/
        );

        await setRecoveryOptionPage.clickSeedPhraseRecoveryOption();
        await expect(page).toMatchAttribute(
            setRecoveryOptionPage.getSeedPhraseSelector(),
            "class",
            /active/
        );

        await setRecoveryOptionPage.clickSeedPhraseRecoveryOption();
        await setRecoveryOptionPage.submitRecoveryOption()

        await expect(page).toMatchURL(
            new RegExp(`/setup-seed-phrase/${testAccountId}/phrase`)
        );
    });
    test("is able to verify seed phrase and access wallet", async ({
        page,
        context,
    }) => {
        // skip test on browsers that don't support clipboard API
        await context
            .grantPermissions(["clipboard-read", "clipboard-write"])
            .catch(test.skip);
        await page.goto(`/setup-seed-phrase/${testAccountId}/phrase`);
        // skip test on mainnet
        const isTestWallet = await page.$(
            'div:text-matches("Test-only Wallet", "i")'
        );
        if (!isTestWallet) {
            test.skip();
        }
        await page.click(`button:text-matches("Copy Phrase", "i")`);
        const copiedSeedPhrase = await page.evaluate(() =>
            navigator.clipboard.readText()
        );
        await expect(page).toHaveSelector(
            'div :text-matches("Passphrase copied", "i")'
        );
        await page.click(`button:text-matches("Continue", "i")`);
        expect(page).toMatchURL(
            new RegExp(`/setup-seed-phrase/${testAccountId}/verify`)
        );
        const wordNumberTextContent = await page.textContent(
            "data-test-id=seedPhraseVerificationWordNumber"
        );
        const wordNumber = parseInt(wordNumberTextContent.slice(6));
        await page.fill(
            "data-test-id=seedPhraseVerificationWordInput",
            copiedSeedPhrase.split(" ")[wordNumber - 1]
        );
        await page.click('[type="submit"]');
        await page.waitForNavigation();
        expect(page).toMatchURL(/\/$/);
        await expect(page).toMatchText(
            "data-test-id=currentUser >> visible=true",
            testAccountId
        );
        testAccountInstance = await connectToAccountWithSeedphrase(
            testAccountId,
            copiedSeedPhrase
        );
    });
});
