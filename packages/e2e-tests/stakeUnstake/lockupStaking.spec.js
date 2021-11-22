const {
    LOCKUP_CONFIGS: { FULLY_UNVESTED_CONFIG },
} = require("../constants");

const { test, expect } = require("../playwrightWithFixtures");
const { HomePage } = require("../register/models/Home");
const { generateNUniqueRandomNumbersInRange } = require("../utils/helpers");
const { StakeUnstakePage } = require("./models/StakeUnstake");

const { describe, beforeAll, afterAll, beforeEach } = test;

describe("Lockup stake and unstake", () => {
    let testAccount, lockupAccount;

    beforeAll(async ({ bankAccount }) => {
        testAccount = await bankAccount.spawnRandomSubAccountInstance().create({ amount: "6.0" });
        lockupAccount = await testAccount.createTestLockupSubAccountInstance(FULLY_UNVESTED_CONFIG);
    });

    afterAll(async () => {
        lockupAccount && (await lockupAccount.delete().then(() => testAccount && testAccount.delete));
    });

    beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(testAccount.accountId, testAccount.seedPhrase);
    });

    test("Is able to run normal staking flow still", async ({ page }) => {
        const stakeUnstakePage = new StakeUnstakePage(page);
        await stakeUnstakePage.navigate();

        await stakeUnstakePage.clickStakeButton();
        const validatorLastIndex = (await stakeUnstakePage.getNumberOfSelectableValidators()) - 1;
        const [randomValidatorIndex] = generateNUniqueRandomNumbersInRange({ from: 0, to: validatorLastIndex }, 1);
        await stakeUnstakePage.runStakingFlowWithAmount(0.1, randomValidatorIndex);
        await expect(page).toMatchText("data-test-id=stakingPageTotalStakedAmount", /0.1 NEAR/);
    });

    test("Stakes and unstakes with locked funds and can't stake with multiple validators simultaneously", async ({ page }) => {
        const stakeUnstakePage = new StakeUnstakePage(page);
        await stakeUnstakePage.navigate();
        await stakeUnstakePage.selectNthAccount(0);
        await expect(page).toMatchText("data-test-id=stakingPageTotalStakedAmount", /0.1 NEAR/);
        await stakeUnstakePage.selectNthAccount(1);
        await expect(page).toMatchText("data-test-id=stakingPageTotalStakedAmount", /0 NEAR/);

        await stakeUnstakePage.clickStakeButton();
        const validatorLastIndex = (await stakeUnstakePage.getNumberOfSelectableValidators()) - 1;
        const randomValidatorIndexes = generateNUniqueRandomNumbersInRange({ from: 0, to: validatorLastIndex }, 2);

        await stakeUnstakePage.runStakingFlowWithAmount(0.2, randomValidatorIndexes[0]);

        await stakeUnstakePage.selectNthAccount(0);
        await expect(page).toMatchText("data-test-id=stakingPageTotalStakedAmount", /0.1 NEAR/);
        await stakeUnstakePage.selectNthAccount(1);
        await expect(page).toMatchText("data-test-id=stakingPageTotalStakedAmount", /0.2 NEAR/);

        await stakeUnstakePage.clickStakeButton();
        await stakeUnstakePage.stakeWithValidator(randomValidatorIndexes[1]);
        await expect(page).toHaveSelector("data-test-id=cantStakeWithValidatorContainer");

        await stakeUnstakePage.clickViewCurrentValidator();
        await stakeUnstakePage.clickValidatorPageUnstakeButton();
        await stakeUnstakePage.submitStakeWithMaxAmount();
        await stakeUnstakePage.confirmStakeOnModal();
        await stakeUnstakePage.returnToDashboard();

        await stakeUnstakePage.selectNthAccount(0);
        await expect(page).toMatchText("data-test-id=stakingPageTotalStakedAmount", /0.1 NEAR/);
        await stakeUnstakePage.selectNthAccount(1);
        await expect(page).toMatchText("data-test-id=stakingPageTotalStakedAmount", /0 NEAR/);

        await stakeUnstakePage.clickStakeButton();
        await stakeUnstakePage.stakeWithValidator(randomValidatorIndexes[1]);
        await expect(page).toHaveSelector("data-test-id=cantStakeWithValidatorContainer");

        await stakeUnstakePage.navigate();
        await stakeUnstakePage.selectNthAccount(1);
        await stakeUnstakePage.clickStakeButton();
    });
});
