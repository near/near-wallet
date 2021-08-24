const { test, expect } = require("@playwright/test");
const { parseNearAmount } = require("near-api-js/lib/utils/format");
const BN = require("bn.js");

const { HomePage } = require("../register/models/Home");
const { createRandomBankSubAccount } = require("../utils/account");
const { SendMoneyPage } = require("./models/SendMoney");

const { describe, beforeAll, afterAll } = test;

describe("Transferring NEAR tokens between two accounts", () => {
    let firstAccount, secondAccount;

    beforeAll(async () => {
        [{ value: firstAccount }, { value: secondAccount }] =
            await Promise.allSettled([
                createRandomBankSubAccount(),
                createRandomBankSubAccount(),
            ]);
    });

    afterAll(async () => {
        await Promise.allSettled([
            firstAccount && firstAccount.delete(),
            secondAccount && secondAccount.delete(),
        ]);
    });

    test("navigates to send money page", async ({ page }) => {
        test.fail(!firstAccount, "first account not successfully created");
        const firstAccountHomePage = new HomePage(page);

        await firstAccountHomePage.navigate();

        await firstAccountHomePage.loginWithSeedPhraseLocalStorage(
            firstAccount.account.accountId,
            firstAccount.seedPhrase
        );

        await firstAccountHomePage.navigate();

        await firstAccountHomePage.clickSendButton();

        await expect(firstAccountHomePage.page).toMatchURL(/send-money$/);
    });
    test("is able to send NEAR tokens", async ({ page }) => {
        test.fail(
            !firstAccount || !secondAccount,
            !firstAccount
                ? "first account not successfully created"
                : "second account not successfully created"
        );
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
        const totalAfter = new BN(balanceAfter.total);
        const totalBefore = new BN(balanceBefore.total);
        const transferedAmount = new BN(parseNearAmount(transferAmount + ""));

        expect(totalAfter.eq(totalBefore.add(transferedAmount))).toBe(true);
    });
});
