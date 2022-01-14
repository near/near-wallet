const { test, expect } = require("../playwrightWithFixtures");
const { parseNearAmount } = require("near-api-js/lib/utils/format");
const BN = require("bn.js");

const { HomePage } = require("../register/models/Home");
const { SendMoneyPage } = require("./models/SendMoney");

const { describe, beforeAll, afterAll } = test;

describe("Transferring NEAR tokens between two accounts", () => {
    let firstAccount;

    beforeAll(async ({ bankAccount }) => {
        firstAccount = bankAccount.spawnRandomSubAccountInstance();
        await firstAccount.create();
    });

    afterAll(async () => {
        await firstAccount.delete();
    });

    test("navigates to send money page", async ({ page }) => {
        const firstAccountHomePage = new HomePage(page);

        await firstAccountHomePage.navigate();

        await firstAccountHomePage.loginWithSeedPhraseLocalStorage(firstAccount.accountId, firstAccount.seedPhrase);

        await firstAccountHomePage.navigate();

        await firstAccountHomePage.clickSendButton();

        await expect(firstAccountHomePage.page).toMatchURL(/send-money$/);
    });
    describe("sending between accounts", () => {
        let secondAccount;

        beforeAll(async ({ bankAccount }) => {
            secondAccount = bankAccount.spawnRandomSubAccountInstance();
            await secondAccount.create();
        });

        afterAll(async () => {
            await secondAccount.delete();
        });

        test("is able to send NEAR tokens", async ({ page }) => {
            const firstAccountHomePage = new HomePage(page);

            await firstAccountHomePage.navigate();

            await firstAccountHomePage.loginWithSeedPhraseLocalStorage(firstAccount.accountId, firstAccount.seedPhrase);
            const firstAccountSendMoneyPage = new SendMoneyPage(page);

            const balanceBefore = await secondAccount.getUpdatedBalance();
            const transferAmount = 0.1;

            await firstAccountSendMoneyPage.navigate();

            await firstAccountSendMoneyPage.selectAsset("NEAR");
            await firstAccountSendMoneyPage.waitForTokenBalance();
            await firstAccountSendMoneyPage.typeAndSubmitAmount(transferAmount);
            await firstAccountSendMoneyPage.typeAndSubmitAccountId(secondAccount.accountId);
            await firstAccountSendMoneyPage.confirmTransaction();

            await expect(page).toMatchText("data-test-id=sendTransactionSuccessMessage", new RegExp(`${transferAmount} NEAR`));
            await expect(page).toMatchText("data-test-id=sendTransactionSuccessMessage", new RegExp(secondAccount.accountId));

            const balanceAfter = await secondAccount.getUpdatedBalance();
            const totalAfter = new BN(balanceAfter.total);
            const totalBefore = new BN(balanceBefore.total);
            const transferedAmount = new BN(parseNearAmount(transferAmount.toString()));

            expect(totalAfter.eq(totalBefore.add(transferedAmount))).toBe(true);
        });
    });
});
