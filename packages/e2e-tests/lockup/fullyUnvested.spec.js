const { BN } = require("bn.js");
const { formatNearAmount, parseNearAmount } = require("near-api-js/lib/utils/format");

const { test, expect } = require("../playwrightWithFixtures");
const { HomePage } = require("../register/models/Home");
const { ProfilePage } = require("./models/ProfilePage");

const { describe, beforeAll, afterAll, beforeEach } = test;

describe("Fully unvested lockup", () => {
    let v2LockupTestAccount, latestLockupTestAccount, v2LockupContractAccount, latestLockupContractAccount;
    const dateNowNanosBN = new BN(Date.now()).mul(new BN("1000000"));
    const fullyUnvestedLockupConfig = {
        amount: "5.0",
        release_duration: "0",
        lockup_timestamp: dateNowNanosBN.sub(new BN("60").mul(new BN("60000000000"))).toString(), // 1 hour ago
        vesting_schedule: {
            VestingSchedule: {
                start_timestamp: dateNowNanosBN.toString(), // now
                end_timestamp: dateNowNanosBN.add(new BN("1051200").mul(new BN("60000000000"))).toString(), // 2 years from now
                cliff_timestamp: dateNowNanosBN.add(new BN("525600").mul(new BN("60000000000"))).toString(), // 1 year from now
            },
        },
    };

    beforeAll(async ({ bankAccount }) => {
        v2LockupTestAccount = await bankAccount.spawnRandomSubAccountInstance().create({ amount: "6.0" });
        v2LockupContractAccount = await v2LockupTestAccount.createTestLockupSubAccountInstance({
            v2Wasm: true,
            ...fullyUnvestedLockupConfig,
        });
        latestLockupTestAccount = await bankAccount.spawnRandomSubAccountInstance().create({ amount: "6.0" });
        latestLockupContractAccount = await latestLockupTestAccount.createTestLockupSubAccountInstance(fullyUnvestedLockupConfig);
    });

    afterAll(async () => {
        await Promise.allSettled([
            v2LockupContractAccount.delete().then(v2LockupTestAccount.delete),
            latestLockupContractAccount.delete().then(latestLockupTestAccount.delete),
        ]);
    });

    test("latest lockup contract displays the whole amount as locked, correct unlocked, correct available to transfer and other info correctly", async ({
        page,
    }) => {
        const { total: lockupTotalBalance } = await latestLockupContractAccount.getUpdatedBalance();
        const lockupUnlockedAmount = new BN(lockupTotalBalance)
            .sub(new BN(parseNearAmount(fullyUnvestedLockupConfig.amount)))
            .toString();
        const lockupAvailableToTransfer = await latestLockupContractAccount.nearApiJsAccount.viewFunction(
            latestLockupContractAccount.accountId,
            "get_liquid_owners_balance"
        );
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(latestLockupTestAccount.accountId, latestLockupTestAccount.seedPhrase);
        const profilePage = new ProfilePage(page);
        await profilePage.navigate();
        await expect(page).toMatchText("data-test-id=lockupAccount.total", new RegExp(formatNearAmount(lockupTotalBalance, 5)));
        await expect(page).toMatchText("data-test-id=lockupAccount.locked", /5 NEAR/);
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.unlocked",
            new RegExp(`${formatNearAmount(lockupUnlockedAmount, 5)} NEAR`)
        );
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.availableToTransfer",
            new RegExp(`${formatNearAmount(lockupAvailableToTransfer, 5)} NEAR`)
        );
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.reservedForStorage",
            /3.5 NEAR/
        );
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.accountId",
            new RegExp(`${latestLockupContractAccount.accountId}`)
        );
        await expect(page).not.toHaveSelector('data-test-id=lockupTransferToWalletButton')
    });
    test("v2 lockup contract displays the whole amount as locked, correct unlocked, correct available to transfer and other info correctly", async ({
        page,
    }) => {
        const { total: lockupTotalBalance } = await v2LockupContractAccount.getUpdatedBalance();
        const lockupUnlockedAmount = new BN(lockupTotalBalance)
            .sub(new BN(parseNearAmount(fullyUnvestedLockupConfig.amount)))
            .toString();
        const lockupAvailableToTransfer = await v2LockupContractAccount.nearApiJsAccount.viewFunction(
            v2LockupContractAccount.accountId,
            "get_liquid_owners_balance"
        );
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(v2LockupTestAccount.accountId, v2LockupTestAccount.seedPhrase);
        const profilePage = new ProfilePage(page);
        await profilePage.navigate();
        await expect(page).toMatchText("data-test-id=lockupAccount.total", new RegExp(formatNearAmount(lockupTotalBalance, 5)));
        await expect(page).toMatchText("data-test-id=lockupAccount.locked", /5 NEAR/);
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.unlocked",
            new RegExp(`${formatNearAmount(lockupUnlockedAmount, 5)} NEAR`)
        );
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.availableToTransfer",
            new RegExp(`${formatNearAmount(lockupAvailableToTransfer, 5)} NEAR`)
        );
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.reservedForStorage",
            /35 NEAR/
        );
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.accountId",
            new RegExp(`${v2LockupContractAccount.accountId}`)
        );
        await expect(page).not.toHaveSelector('data-test-id=lockupTransferToWalletButton')
    });
});
