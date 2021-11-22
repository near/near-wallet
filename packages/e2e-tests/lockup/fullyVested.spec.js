const { BN } = require("bn.js");
const { formatNearAmount, parseNearAmount } = require("near-api-js/lib/utils/format");

const { test, expect } = require("../playwrightWithFixtures");
const { HomePage } = require("../register/models/Home");
const { ProfilePage } = require("./models/ProfilePage");
const {
    LOCKUP_CONFIGS: { FULLY_VESTED_CONFIG },
} = require("../constants");
const { bnIsWithinUncertainty } = require("../utils/helpers");

const { describe, beforeAll, afterAll } = test;

describe("Fully vested lockup", () => {
    let v2LockupTestAccount, latestLockupTestAccount, v2LockupContractAccount, latestLockupContractAccount;

    beforeAll(async ({ bankAccount }) => {
        v2LockupTestAccount = await bankAccount.spawnRandomSubAccountInstance().create({ amount: "6.0" });
        v2LockupContractAccount = await v2LockupTestAccount.createTestLockupSubAccountInstance({
            v2Wasm: true,
            ...FULLY_VESTED_CONFIG,
        });
        latestLockupTestAccount = await bankAccount.spawnRandomSubAccountInstance().create({ amount: "6.0" });
        latestLockupContractAccount = await latestLockupTestAccount.createTestLockupSubAccountInstance(FULLY_VESTED_CONFIG);
    });

    afterAll(async () => {
        await Promise.allSettled([
            v2LockupContractAccount && v2LockupContractAccount.delete().then(v2LockupTestAccount.delete),
            latestLockupContractAccount && latestLockupContractAccount.delete().then(latestLockupTestAccount.delete),
        ]);
    });

    test("latest lockup contract displays the zero as locked, correct unlocked, correct available to transfer and other info correctly", async ({
        page,
    }) => {
        const { total: lockupTotalBalance } = await latestLockupContractAccount.getUpdatedBalance();
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(latestLockupTestAccount.accountId, latestLockupTestAccount.seedPhrase);
        const profilePage = new ProfilePage(page);
        await profilePage.navigate();
        await expect(page).toMatchText("data-test-id=lockupAccount.total", new RegExp(formatNearAmount(lockupTotalBalance, 5)));
        await expect(page).toMatchText("data-test-id=lockupAccount.locked", /0 NEAR/);
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.unlocked",
            new RegExp(`${formatNearAmount(lockupTotalBalance, 5)} NEAR`)
        );
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.availableToTransfer",
            new RegExp(`${formatNearAmount(lockupTotalBalance, 5)} NEAR`)
        );
        await expect(page).toMatchText("data-test-id=lockupAccount.reservedForStorage", /3.5 NEAR/);
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.accountId",
            new RegExp(`${latestLockupContractAccount.accountId}`)
        );
        await expect(page).toHaveSelector("data-test-id=lockupTransferToWalletButton");
    });
    test("latest lockup contract withdraws and updates balances and cleans up correctly", async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(latestLockupTestAccount.accountId, latestLockupTestAccount.seedPhrase);

        const profilePage = new ProfilePage(page);
        await profilePage.navigate();

        const { total: lockupTotalBalance } = await latestLockupContractAccount.getUpdatedBalance();
        const initialBalanceDisplay = await profilePage.getOwnerAccountTotalBalance();
        const initialOwnerAccountDisplayedBalance = new BN(parseNearAmount(initialBalanceDisplay));
        const { total: initialOwnerAccountBalance } = await latestLockupTestAccount.getUpdatedBalance();

        await expect(page).toHaveSelector("data-test-id=lockupTransferToWalletButton");
        await profilePage.transferToWallet();
        await expect(page).not.toHaveSelector("data-test-id=lockupTransferToWalletButton");
        await expect(page).not.toHaveSelector("data-test-id=lockupAccount.total");

        const balanceDisplay = await profilePage.getOwnerAccountTotalBalance();
        const ownerAccountDisplayedBalance = new BN(parseNearAmount(balanceDisplay));
        const displayedOwnersBalanceChange = ownerAccountDisplayedBalance.sub(initialOwnerAccountDisplayedBalance);
        const { total: ownerAccountBalance } = await latestLockupTestAccount.getUpdatedBalance();
        const ownersBalanceChange = new BN(ownerAccountBalance).sub(new BN(initialOwnerAccountBalance));
        const uncertaintyForGas = new BN(parseNearAmount("0.1"));

        await expect(bnIsWithinUncertainty(uncertaintyForGas, new BN(lockupTotalBalance), displayedOwnersBalanceChange)).toBe(
            true
        );
        await expect(bnIsWithinUncertainty(uncertaintyForGas, new BN(lockupTotalBalance), ownersBalanceChange)).toBe(true);
    });
    test("v2 lockup contract displays zero as locked, correct unlocked, correct available to transfer and other info correctly", async ({
        page,
    }) => {
        const { total: lockupTotalBalance } = await v2LockupContractAccount.getUpdatedBalance();
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(v2LockupTestAccount.accountId, v2LockupTestAccount.seedPhrase);
        const profilePage = new ProfilePage(page);
        await profilePage.navigate();
        await expect(page).toMatchText("data-test-id=lockupAccount.total", new RegExp(formatNearAmount(lockupTotalBalance, 5)));
        await expect(page).toMatchText("data-test-id=lockupAccount.locked", /0 NEAR/);
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.unlocked",
            new RegExp(`${formatNearAmount(lockupTotalBalance, 5)} NEAR`)
        );
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.availableToTransfer",
            new RegExp(`${formatNearAmount(lockupTotalBalance, 5)} NEAR`)
        );
        await expect(page).toMatchText("data-test-id=lockupAccount.reservedForStorage", /35 NEAR/);
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.accountId",
            new RegExp(`${v2LockupContractAccount.accountId}`)
        );
        await expect(page).toHaveSelector("data-test-id=lockupTransferToWalletButton");
    });
    test("v2 lockup contract withdraws and updates balances and cleans up correctly", async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(v2LockupTestAccount.accountId, v2LockupTestAccount.seedPhrase);

        const profilePage = new ProfilePage(page);
        await profilePage.navigate();

        const { total: lockupTotalBalance } = await v2LockupContractAccount.getUpdatedBalance();
        const initialBalanceDisplay = await profilePage.getOwnerAccountTotalBalance();
        const initialOwnerAccountDisplayedBalance = new BN(parseNearAmount(initialBalanceDisplay));
        const { total: initialOwnerAccountBalance } = await v2LockupTestAccount.getUpdatedBalance();

        await expect(page).toHaveSelector("data-test-id=lockupTransferToWalletButton");
        await profilePage.transferToWallet();
        await expect(page).not.toHaveSelector("data-test-id=lockupTransferToWalletButton");
        await expect(page).not.toHaveSelector("data-test-id=lockupAccount.total");

        const balanceDisplay = await profilePage.getOwnerAccountTotalBalance();
        const ownerAccountDisplayedBalance = new BN(parseNearAmount(balanceDisplay));
        const displayedOwnersBalanceChange = ownerAccountDisplayedBalance.sub(initialOwnerAccountDisplayedBalance);
        const { total: ownerAccountBalance } = await v2LockupTestAccount.getUpdatedBalance();
        const ownersBalanceChange = new BN(ownerAccountBalance).sub(new BN(initialOwnerAccountBalance));
        const uncertaintyForGas = new BN(parseNearAmount("0.1"));

        console.log(`Change in displayed balance: ${formatNearAmount(displayedOwnersBalanceChange.toString())}`, `Lockup balance ${formatNearAmount(lockupTotalBalance)}`)

        await expect(bnIsWithinUncertainty(uncertaintyForGas, new BN(lockupTotalBalance), displayedOwnersBalanceChange)).toBe(
            true
        );
        await expect(bnIsWithinUncertainty(uncertaintyForGas, new BN(lockupTotalBalance), ownersBalanceChange)).toBe(true);
    });
});
