const { BN } = require("bn.js");
const { formatNearAmount, parseNearAmount } = require("near-api-js/lib/utils/format");

const { test, expect } = require("../playwrightWithFixtures");
const { HomePage } = require("../register/models/Home");
const { bnSaturatingSub, bnIsWithinUncertainty } = require("../utils/helpers");
const { ProfilePage } = require("./models/ProfilePage");
const {
    LOCKUP_CONFIGS: { HALF_VESTED_CONFIG },
} = require("../constants");

const { describe, beforeAll, afterAll } = test;

describe("haLf vested lockup", () => {
    let v2LockupTestAccount, latestLockupTestAccount, v2LockupContractAccount, latestLockupContractAccount;

    beforeAll(async ({ bankAccount }) => {
        v2LockupTestAccount = await bankAccount.spawnRandomSubAccountInstance().create({ amount: "37.0" });
        v2LockupContractAccount = await v2LockupTestAccount.createTestLockupSubAccountInstance({
            ...HALF_VESTED_CONFIG,
            v2Wasm: true,
            amount: "36.0",
        });
        latestLockupTestAccount = await bankAccount.spawnRandomSubAccountInstance().create({ amount: "6.0" });
        latestLockupContractAccount = await latestLockupTestAccount.createTestLockupSubAccountInstance({
            ...HALF_VESTED_CONFIG,
            amount: "5.0",
        });
    });

    afterAll(async () => {
        await Promise.allSettled([
            v2LockupContractAccount && v2LockupContractAccount.delete().then(v2LockupTestAccount.delete),
            latestLockupContractAccount && latestLockupContractAccount.delete().then(latestLockupTestAccount.delete),
        ]);
    });

    test("latest lockup contract displays the zero as locked, correct unlocked, correct available to transfer and other info correctly", async ({
        page,
        bankAccount,
    }) => {
        const { total: lockupTotalBalance } = await latestLockupContractAccount.getUpdatedBalance();
        const lockupLockedAmount = new BN(
            await bankAccount.nearApiJsAccount.viewFunction(latestLockupContractAccount.accountId, "get_locked_amount")
        );
        const lockupUnlockedAmount = new BN(lockupTotalBalance).sub(lockupLockedAmount);
        const storageCost = new BN(parseNearAmount("3.5"));
        const lockupAvailableToTransfer = bnSaturatingSub(new BN(lockupTotalBalance), BN.max(storageCost, lockupLockedAmount));

        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(latestLockupTestAccount.accountId, latestLockupTestAccount.seedPhrase);

        const profilePage = new ProfilePage(page);
        await profilePage.navigate();
        await expect(page).toMatchText("data-test-id=lockupAccount.total", new RegExp(formatNearAmount(lockupTotalBalance, 5)));
        const displayedLockedAmount = parseNearAmount(await profilePage.getLockupAccountLocked());
        const displayedUnlockedAmount = parseNearAmount(await profilePage.getLockupAccountUnlocked());

        await expect(
            bnIsWithinUncertainty(new BN(parseNearAmount("0.01")), new BN(displayedLockedAmount), lockupLockedAmount)
        ).toBe(true);
        await expect(
            bnIsWithinUncertainty(new BN(parseNearAmount("0.01")), new BN(displayedUnlockedAmount), lockupUnlockedAmount)
        ).toBe(true);
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.availableToTransfer",
            new RegExp(`^${formatNearAmount(lockupAvailableToTransfer.toString(), 5)}`)
        );
        await expect(page).toMatchText("data-test-id=lockupAccount.reservedForStorage", /3.5 NEAR/);
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.accountId",
            new RegExp(`${latestLockupContractAccount.accountId}`)
        );
        await expect(page).toHaveSelector("data-test-id=lockupTransferToWalletButton");
    });
    test("latest lockup contract withdraws and updates balances and cleans up correctly", async ({ page, bankAccount }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(latestLockupTestAccount.accountId, latestLockupTestAccount.seedPhrase);

        const profilePage = new ProfilePage(page);
        await profilePage.navigate();

        const initialLockupAvailableToTransfer = new BN(
            await bankAccount.nearApiJsAccount.viewFunction(latestLockupContractAccount.accountId, "get_liquid_owners_balance")
        );
        const initialBalanceDisplay = await profilePage.getOwnerAccountTotalBalance();
        const initialOwnerAccountDisplayedBalance = new BN(parseNearAmount(initialBalanceDisplay));
        const { total: initialOwnerAccountBalance } = await latestLockupTestAccount.getUpdatedBalance();

        await expect(page).toHaveSelector("data-test-id=lockupTransferToWalletButton");
        await profilePage.transferToWallet();
        await expect(page).not.toHaveSelector("data-test-id=lockupTransferToWalletButton");

        const balanceDisplay = await profilePage.getOwnerAccountTotalBalance();
        const ownerAccountDisplayedBalance = new BN(parseNearAmount(balanceDisplay));
        const displayedOwnersBalanceChange = ownerAccountDisplayedBalance.sub(initialOwnerAccountDisplayedBalance);
        const { total: ownerAccountBalance } = await latestLockupTestAccount.getUpdatedBalance();
        const ownersBalanceChange = new BN(ownerAccountBalance).sub(new BN(initialOwnerAccountBalance));
        const lockupAvailableToTransfer = new BN(
            await bankAccount.nearApiJsAccount.viewFunction(latestLockupContractAccount.accountId, "get_liquid_owners_balance")
        );
        const uncertaintyForGas = new BN(parseNearAmount("0.1"));

        await expect(bnIsWithinUncertainty(uncertaintyForGas, initialLockupAvailableToTransfer, displayedOwnersBalanceChange)).toBe(true);
        await expect(bnIsWithinUncertainty(uncertaintyForGas, initialLockupAvailableToTransfer, ownersBalanceChange)).toBe(true);
        await expect(lockupAvailableToTransfer.lt(new BN(parseNearAmount("0.01")))).toBe(true);
    });
    test("v2 lockup contract displays zero as locked, correct unlocked, correct available to transfer and other info correctly", async ({
        page,
        bankAccount,
    }) => {
        const { total: lockupTotalBalance } = await v2LockupContractAccount.getUpdatedBalance();
        const lockupLockedAmount = new BN(
            await bankAccount.nearApiJsAccount.viewFunction(v2LockupContractAccount.accountId, "get_locked_amount")
        );
        const lockupUnlockedAmount = new BN(lockupTotalBalance).sub(lockupLockedAmount);
        const storageCost = new BN(parseNearAmount("35"));
        const lockupAvailableToTransfer = bnSaturatingSub(new BN(lockupTotalBalance), BN.max(storageCost, lockupLockedAmount));

        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(v2LockupTestAccount.accountId, v2LockupTestAccount.seedPhrase);

        const profilePage = new ProfilePage(page);
        await profilePage.navigate();
        await expect(page).toMatchText("data-test-id=lockupAccount.total", new RegExp(formatNearAmount(lockupTotalBalance, 5)));
        const displayedLockedAmount = parseNearAmount(await profilePage.getLockupAccountLocked());
        const displayedUnlockedAmount = parseNearAmount(await profilePage.getLockupAccountUnlocked());

        await expect(
            bnIsWithinUncertainty(new BN(parseNearAmount("0.01")), new BN(displayedLockedAmount), lockupLockedAmount)
        ).toBe(true);
        await expect(
            bnIsWithinUncertainty(new BN(parseNearAmount("0.01")), new BN(displayedUnlockedAmount), lockupUnlockedAmount)
        ).toBe(true);
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.availableToTransfer",
            new RegExp(`^${formatNearAmount(lockupAvailableToTransfer.toString(), 5)}`)
        );
        await expect(page).toMatchText("data-test-id=lockupAccount.reservedForStorage", /35 NEAR/);
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.accountId",
            new RegExp(`${v2LockupContractAccount.accountId}`)
        );
        await expect(page).toHaveSelector("data-test-id=lockupTransferToWalletButton");
    });
    test("v2 lockup contract withdraws and updates balances and cleans up correctly", async ({ page, bankAccount }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(v2LockupTestAccount.accountId, v2LockupTestAccount.seedPhrase);

        const profilePage = new ProfilePage(page);
        await profilePage.navigate();

        const initialLockupAvailableToTransfer = new BN(
            await bankAccount.nearApiJsAccount.viewFunction(v2LockupContractAccount.accountId, "get_liquid_owners_balance")
        );
        const initialBalanceDisplay = await profilePage.getOwnerAccountTotalBalance();
        const initialOwnerAccountDisplayedBalance = new BN(parseNearAmount(initialBalanceDisplay));
        const { total: initialOwnerAccountBalance } = await v2LockupTestAccount.getUpdatedBalance();

        await expect(page).toHaveSelector("data-test-id=lockupTransferToWalletButton");
        await profilePage.transferToWallet();
        await expect(page).not.toHaveSelector("data-test-id=lockupTransferToWalletButton");

        const balanceDisplay = await profilePage.getOwnerAccountTotalBalance();
        const ownerAccountDisplayedBalance = new BN(parseNearAmount(balanceDisplay));
        const displayedOwnersBalanceChange = ownerAccountDisplayedBalance.sub(initialOwnerAccountDisplayedBalance);
        const { total: ownerAccountBalance } = await v2LockupTestAccount.getUpdatedBalance();
        const ownersBalanceChange = new BN(ownerAccountBalance).sub(new BN(initialOwnerAccountBalance));
        const lockupAvailableToTransfer = new BN(
            await bankAccount.nearApiJsAccount.viewFunction(v2LockupContractAccount.accountId, "get_liquid_owners_balance")
        );
        const uncertaintyForGas = new BN(parseNearAmount("0.1"));

        await expect(bnIsWithinUncertainty(uncertaintyForGas, initialLockupAvailableToTransfer, displayedOwnersBalanceChange)).toBe(true);
        await expect(bnIsWithinUncertainty(uncertaintyForGas, initialLockupAvailableToTransfer, ownersBalanceChange)).toBe(true);
        await expect(lockupAvailableToTransfer.lt(new BN(parseNearAmount("0.01")))).toBe(true);
    });
});
