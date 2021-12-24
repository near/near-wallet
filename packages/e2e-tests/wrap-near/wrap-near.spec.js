const { test, expect } = require("@playwright/test");
const { parseNearAmount } = require("near-api-js/lib/utils/format");
const BN = require("bn.js");

const { HomePage } = require("../register/models/Home");
const { WrapNearPage } = require("./models/WrapNear");
const { getBankAccount } = require("../utils/account");
const { walletNetwork } = require("../utils/config");

const { describe, beforeAll, afterAll } = test;

describe("wNEAR tokens", () => {

    describe("Wrapping wNEAR", () => {
        let account;

        beforeAll(async () => {
            const bankAccount = await getBankAccount();
            account = bankAccount.spawnRandomSubAccountInstance();
            await account.create();
        });

        afterAll(async () => {
            await account.delete();
        });

        test("navigates to wrap near page", async ({ page }) => {
            const homePage = new HomePage(page);

            await homePage.navigate();

            await homePage.loginWithSeedPhraseLocalStorage(account.accountId, account.seedPhrase);
            await homePage.navigate();
            await page.click("div:visible.user-account");
            await page.click("[data-test-id=wrapNearNavLink]:visible");

            await expect(page).toMatchURL(/wrap$/);
        });


        test("is able to wrap NEAR to wNEAR", async ({ page }) => {
            const homePage = new HomePage(page);

            await homePage.navigate();

            await homePage.loginWithSeedPhraseLocalStorage(account.accountId, account.seedPhrase);

            const wrapAmount = 0.1;
            const contractName = `wrap.${walletNetwork}`;
            const beforeWNearBalance = new BN(await account.getFungibleTokenBalance(contractName));


            const wrapNearPage = new WrapNearPage(page);
            await wrapNearPage.navigate();
            await wrapOrUnWrapNear(wrapAmount, false, wrapNearPage);

            await expect(page).toMatchText("data-test-id=wrapNearTransactionSuccessMessage", new RegExp(`wrapped`));
            await expect(page).toMatchText("data-test-id=wrapNearTransactionSuccessMessage", new RegExp(`${wrapAmount} NEAR`));
            await expect(page).toMatchText("data-test-id=wrapNearTransactionSuccessMessage", new RegExp(`to ${wrapAmount} wNEAR`));

            const afterWNearBalance = new BN(await account.getFungibleTokenBalance(contractName));
            const wrappedAmount = new BN(parseNearAmount(wrapAmount.toString()));
            expect(afterWNearBalance.eq(beforeWNearBalance.add(wrappedAmount))).toBe(true);
        });
    });


    describe("Unwrap wNEAR", () => {
        let account;
        beforeAll(async () => {
            const bankAccount = await getBankAccount();
            account = bankAccount.spawnRandomSubAccountInstance();
            await account.create();
            await account.wrapNear(parseNearAmount("0.5"));
        });

        afterAll(async () => {
            await account.delete();
        });

        test("is able to unwrap wNEAR tokens", async ({ page }) => {
            const homePage = new HomePage(page);

            await homePage.navigate();

            await homePage.loginWithSeedPhraseLocalStorage(account.accountId, account.seedPhrase);



            const wrapAmount = 0.5;
            const contractName = `wrap.${walletNetwork}`;

            const wrapNearPage = new WrapNearPage(page);
            await wrapNearPage.navigate();
            const beforeWNearBalance = new BN(await account.getFungibleTokenBalance(contractName));
            await wrapOrUnWrapNear(wrapAmount, true, wrapNearPage);

            await expect(page).toMatchText("data-test-id=wrapNearTransactionSuccessMessage", new RegExp(`unwrapped`));
            await expect(page).toMatchText("data-test-id=wrapNearTransactionSuccessMessage", new RegExp(`${wrapAmount} wNEAR`));
            await expect(page).toMatchText("data-test-id=wrapNearTransactionSuccessMessage", new RegExp(`to ${wrapAmount} NEAR`));

            const afterWNearBalance = new BN(await account.getFungibleTokenBalance(contractName));
            const wrappedAmount = new BN(parseNearAmount(wrapAmount.toString()));

            expect(afterWNearBalance.eq(beforeWNearBalance.sub(wrappedAmount))).toBe(true);
        });


    });



    describe("Unwrap wNEAR Banner", () => {
        let account;
        beforeAll(async () => {
            const bankAccount = await getBankAccount();
            account = bankAccount.spawnRandomSubAccountInstance();
            await account.create();
            await account.wrapNear(parseNearAmount("0.96"));
        });

        afterAll(async () => {
            await account.delete();
        });

        test("navigates to unwrap near page (through banner)", async ({ page }) => {
            const homePage = new HomePage(page);

            await homePage.navigate();

            await homePage.loginWithSeedPhraseLocalStorage(account.accountId, account.seedPhrase);

            await homePage.navigate();
            await homePage.clickUnwrapBannerButton();
            await expect(homePage.page).toMatchURL(/wrap\/unwrap$/);
        });

        test("is able to unwrap near (through banner)", async ({ page }) => {
            const homePage = new HomePage(page);

            await homePage.navigate();

            await homePage.loginWithSeedPhraseLocalStorage(account.accountId, account.seedPhrase);

            await homePage.navigate();
            await homePage.clickUnwrapBannerButton();
            await expect(homePage.page).toMatchURL(/wrap\/unwrap$/);

            const wrapAmount = 0.5;
            const contractName = `wrap.${walletNetwork}`;

            const wrapNearPage = new WrapNearPage(page);
            const beforeWNearBalance = new BN(await account.getFungibleTokenBalance(contractName));
            await wrapOrUnWrapNear(wrapAmount, false, wrapNearPage);


            await expect(page).toMatchText("data-test-id=wrapNearTransactionSuccessMessage", new RegExp(`unwrapped`));
            await expect(page).toMatchText("data-test-id=wrapNearTransactionSuccessMessage", new RegExp(`${wrapAmount} wNEAR`));
            await expect(page).toMatchText("data-test-id=wrapNearTransactionSuccessMessage", new RegExp(`to ${wrapAmount} NEAR`));

            const afterWNearBalance = new BN(await account.getFungibleTokenBalance(contractName));
            const wrappedAmount = new BN(parseNearAmount(wrapAmount.toString()));
            expect(afterWNearBalance.eq(beforeWNearBalance.sub(wrappedAmount))).toBe(true);
        });


    });


    describe("Insufficient NEAR and wNEAR", () => {
        let account;
        beforeAll(async () => {
            const bankAccount = await getBankAccount();
            account = bankAccount.spawnRandomSubAccountInstance();
            await account.create({ amount: "0.00200" });

        });

        afterAll(async () => {
            await account.delete();
        });

        test("does not show Unwrap Banner", async ({ page }) => {
            const homePage = new HomePage(page);

            await homePage.navigate();

            await homePage.loginWithSeedPhraseLocalStorage(account.accountId, account.seedPhrase);

            await homePage.navigate();

            await expect(homePage.page.locator("data-test-id=depositNearBanner")).toBeVisible();
            await expect(homePage.page.locator("data-test-id=unwrapWNearBanner")).toHaveCount(0);
        });


    });

});


const wrapOrUnWrapNear = async (wrapAmount, clickSwapButton, wrapNearPage) => {
    if (clickSwapButton) {
        await wrapNearPage.clickSwapTokenButton();
    }
    await wrapNearPage.waitForFromTokenBalance();
    await wrapNearPage.typeAndSubmitAmount(wrapAmount);
    await wrapNearPage.confirmTransaction();
    return wrapNearPage;
}