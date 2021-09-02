const { test, expect } = require("@playwright/test");
const BN = require("bn.js");
const { parseNearAmount } = require("near-api-js/lib/utils/format");
const { HomePage } = require("../register/models/Home");

const { createRandomBankSubAccount } = require("../utils/account");
const { StakeUnstakePage } = require("./models/StakeUnstake");

const { describe, beforeAll, afterAll, beforeEach } = test;

describe("Login with Dapp", () => {
    let testAccount;

    beforeAll(async () => {
        testAccount = await createRandomBankSubAccount();
    });

    beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(testAccount.account.accountId, testAccount.seedPhrase);
    });

    afterAll(async () => {
        testAccount && (await testAccount.delete());
    });

    test("navigates to staking page with correct balance", async ({ page }) => {
        const stakeUnstakePage = new StakeUnstakePage(page);
        await stakeUnstakePage.navigate();

        await expect(page).toMatchURL(/\/staking$/);
        // TODO assert current balance
        await expect(page).toMatchText("data-test-id=accountSelectStakedBalance", "0 NEAR");
    });
    test("correctly searches for validators", async ({ page }) => {
        const stakeUnstakePage = new StakeUnstakePage(page);
        await stakeUnstakePage.navigate();
        await stakeUnstakePage.clickStakeButton();
        const firstValidatorName = await stakeUnstakePage.getFirstValidatorName();
        await stakeUnstakePage.searhForValidator(firstValidatorName);

        await expect(page).toHaveSelector("data-test-id=stakingPageValidatorFoundLabel");
        await expect(page).toHaveSelectorCount("data-test-id=stakingPageValidatorItem", 1);
    });
    test("correctly selects and stakes with validator", async ({ page }) => {
        const testStakeAmount = 0.1;
        const stakeUnstakePage = new StakeUnstakePage(page);
        await stakeUnstakePage.navigate();
        let currentlyDisplayedWalletBalance = await stakeUnstakePage.getCurrentlyDisplayedBalance();
        await stakeUnstakePage.clickStakeButton();
        const firstValidatorName = await stakeUnstakePage.getFirstValidatorName();
        await stakeUnstakePage.selectFirstValidator();

        await expect(page).toMatchURL(new RegExp(`/${firstValidatorName}$`));
        await expect(page).toMatchText("data-test-id=validatorNamePageTitle", new RegExp(`${firstValidatorName}`));

        await stakeUnstakePage.clickStakeWithValidator();
        await stakeUnstakePage.submitStakeWithAmount(testStakeAmount);
        await stakeUnstakePage.confirmStakeOnModal();

        await expect(page).toHaveSelector("data-test-id=stakingSuccessMessage");

        await stakeUnstakePage.returnToDashboard();

        await expect(page).toMatchURL(/\/staking$/);

        const maxRemainingNear = currentlyDisplayedWalletBalance.sub(
            new BN(parseNearAmount(testStakeAmount.toString()))
        );
        currentlyDisplayedWalletBalance = await stakeUnstakePage.getCurrentlyDisplayedBalance();
        await expect(maxRemainingNear.gt(currentlyDisplayedWalletBalance)).toBe(true);
        await expect(page).toMatchText(
            "data-test-id=accountSelectStakedBalance",
            new RegExp(testStakeAmount.toString())
        );
        const { staked: stakedBalance } = await testAccount.account.getAccountBalance();

        expect(stakedBalance).toEqual(parseNearAmount(stakedBalance));
    });
});
