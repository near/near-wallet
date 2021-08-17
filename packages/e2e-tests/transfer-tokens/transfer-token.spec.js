const { test, expect } = require("@playwright/test");
const { parseNearAmount } = require("near-api-js/lib/utils/format");
const { HomePage } = require("../register/models/Home");

const { createRandomBankSubAccount } = require("../utils/account");
const { SendMoneyPage } = require("./models/SendMoney");

const { describe, beforeAll, afterAll } = test;

describe("Transferring NEAR tokens between two accounts", () => {
    let firstAccount, secondAccount;

    beforeAll(async () => {
        firstAccount = await createRandomBankSubAccount();
        secondAccount = await createRandomBankSubAccount();
    });

    afterAll(async () => {
        firstAccount && (await firstAccount.delete());
        secondAccount && (await secondAccount.delete());
    });

    test("navigates to send money page", async ({ page }) => {
        const firstAccountHomePage = new HomePage(page);

        await firstAccountHomePage.navigate();

        await firstAccountHomePage.loginWithSeedPhraseLocalStorage(
            firstAccount.account.accountId,
            firstAccount.seedPhrase
        );

        await firstAccountHomePage.navigate();

        await firstAccountHomePage.clickSendButton();

        expect(firstAccountHomePage.page).toMatchURL(/send-money$/);
    });
    test("is able to send NEAR tokens", async ({ page }) => {
        const firstAccountHomePage = new HomePage(page);

        await firstAccountHomePage.navigate();

        await firstAccountHomePage.loginWithSeedPhraseLocalStorage(
            firstAccount.account.accountId,
            firstAccount.seedPhrase
        );
        const firstAccountSendMoneyPage = new SendMoneyPage(page);

        const balanceBefore = await (
            await secondAccount.getAccountInstance()
        ).getAccountBalance();
        const transferAmount = 0.1;

        await firstAccountSendMoneyPage.navigate();

        await firstAccountSendMoneyPage.selectAsset("NEAR");
        await firstAccountSendMoneyPage.waitForTokenBalance();
        await firstAccountSendMoneyPage.typeAndSubmitAmount(transferAmount);
        await firstAccountSendMoneyPage.typeAndSubmitAccountId(
            secondAccount.account.accountId
        );
        await firstAccountSendMoneyPage.confirmTransaction();
        
        await expect(page).toMatchText(
            'span:text-matches("Transaction complete!", "i")',
            new RegExp(`${transferAmount} NEAR`)
        );
        await expect(page).toMatchText(
            'span:text-matches("Transaction complete!", "i")',
            new RegExp(secondAccount.account.accountId)
        );

        const balanceAfter = await (
            await secondAccount.getAccountInstance()
        ).getAccountBalance();
        expect(parseInt(balanceAfter.total)).toEqual(
            parseInt(balanceBefore.total) +
                parseInt(parseNearAmount(transferAmount + ""))
        );
    });
});
