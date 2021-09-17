const { test, expect } = require("@playwright/test");
const { parseNearAmount } = require("near-api-js/lib/utils/format");
const BN = require("bn.js");

const { HomePage } = require("../register/models/Home");
const { SendMoneyPage } = require("./models/SendMoney");
const { getBankAccount } = require("../utils/account");

const { describe, beforeAll, afterAll } = test;

describe("Transferring NEAR tokens between two accounts", () => {
    let firstAccount, secondAccount;

    beforeAll(async () => {
        const bankAccount = await getBankAccount();
        firstAccount = bankAccount.spawnRandomSubAccountInstance();
        secondAccount = bankAccount.spawnRandomSubAccountInstance();
        await Promise.allSettled([
            firstAccount.create(),
            secondAccount.create(),
        ]);
    });

    afterAll(async () => {
        await Promise.allSettled([
            firstAccount.delete(),
            secondAccount.delete(),
        ]);
    });

    test("navigates to send money page", async ({ page }) => {
        test.fail(!firstAccount.isCreated, "first account not successfully created");
        const firstAccountHomePage = new HomePage(page);

        await firstAccountHomePage.navigate();

        await firstAccountHomePage.loginWithSeedPhraseLocalStorage(
            firstAccount.accountId,
            firstAccount.seedPhrase
        );

        await firstAccountHomePage.navigate();

        await firstAccountHomePage.clickSendButton();

        await expect(firstAccountHomePage.page).toMatchURL(/send-money$/);
    });
    test("is able to send NEAR tokens", async ({ page }) => {
        test.fail(
            !firstAccount.isCreated || !secondAccount.isCreated,
            !firstAccount.isCreated
                ? "first account not successfully created"
                : "second account not successfully created"
        );
        const firstAccountHomePage = new HomePage(page);

        await firstAccountHomePage.navigate();

        await firstAccountHomePage.loginWithSeedPhraseLocalStorage(
            firstAccount.accountId,
            firstAccount.seedPhrase
        );
        const firstAccountSendMoneyPage = new SendMoneyPage(page);

        const balanceBefore = await secondAccount.getUpdatedBalance();
        const transferAmount = 0.1;

        await firstAccountSendMoneyPage.navigate();

        await firstAccountSendMoneyPage.selectAsset("NEAR");
        await firstAccountSendMoneyPage.waitForTokenBalance();
        await firstAccountSendMoneyPage.typeAndSubmitAmount(transferAmount);
        await firstAccountSendMoneyPage.typeAndSubmitAccountId(
            secondAccount.accountId
        );
        await firstAccountSendMoneyPage.confirmTransaction();

        await expect(page).toMatchText(
            "data-test-id=sendTransactionSuccessMessage",
            new RegExp(`${transferAmount} NEAR`)
        );
        await expect(page).toMatchText(
            "data-test-id=sendTransactionSuccessMessage",
            new RegExp(secondAccount.accountId)
        );
        
        const balanceAfter = await secondAccount.getUpdatedBalance();
        const totalAfter = new BN(balanceAfter.total);
        const totalBefore = new BN(balanceBefore.total);
        const transferedAmount = new BN(parseNearAmount(transferAmount.toString()));

        expect(totalAfter.eq(totalBefore.add(transferedAmount))).toBe(true);
    });
});
