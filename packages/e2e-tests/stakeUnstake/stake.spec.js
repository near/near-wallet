const { test, expect } = require("../playwrightWithFixtures");
const BN = require("bn.js");
const { parseNearAmount, formatNearAmount } = require("near-api-js/lib/utils/format");

const { HomePage } = require("../register/models/Home");
const { StakeUnstakePage } = require("./models/StakeUnstake");

const { describe, beforeAll, afterAll, beforeEach } = test;

describe("Staking flow", () => {
    let testAccount;

    beforeAll(async ({ bankAccount }) => {
        testAccount = bankAccount.spawnRandomSubAccountInstance();
        await testAccount.create();
    });

    beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(testAccount.accountId, testAccount.seedPhrase);
    });

    afterAll(async () => {
        await testAccount.delete();
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
        const firstValidatorName = await stakeUnstakePage.getValidatorName();
        await stakeUnstakePage.searhForValidator(firstValidatorName);

        await expect(page).toHaveSelector("data-test-id=stakingPageValidatorFoundLabel");
        await expect(page).toHaveSelectorCount("data-test-id=stakingPageValidatorItem", 1);
    });
    test("correctly selects and stakes with validator", async ({ page }) => {
        const testStakeAmount = 0.1;
        const validatorIndex = 0;

        const stakeUnstakePage = new StakeUnstakePage(page);
        await stakeUnstakePage.navigate();
        let currentlyDisplayedWalletBalance = await stakeUnstakePage.getCurrentlyDisplayedBalance();
        await stakeUnstakePage.clickStakeButton();
        const validatorName = await stakeUnstakePage.getValidatorName(validatorIndex);
        await stakeUnstakePage.stakeWithValidator(validatorIndex);

        await expect(page).toMatchURL(new RegExp(`/${validatorName}$`));
        await expect(page).toMatchText("data-test-id=validatorNamePageTitle", new RegExp(`${validatorName}`));

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
        await expect(page).toMatchText(
            "data-test-id=stakingPageTotalStakedAmount",
            new RegExp(testStakeAmount.toString())
        );

        const stakedAmount = await testAccount.getAmountStakedWithValidator(validatorName);

        expect(formatNearAmount(stakedAmount.toString(), 5)).toBe(testStakeAmount.toString());
    });
});
