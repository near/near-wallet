const { BN } = require("bn.js");
const { formatNearAmount } = require("near-api-js/lib/utils/format");

const { test, expect } = require("../playwrightWithFixtures");
const { HomePage } = require("../register/models/Home");
const { ProfilePage } = require("./models/ProfilePage");

const { describe, beforeAll, afterAll } = test;

describe("Fully vested lockup", () => {
    let v2LockupTestAccount, latestLockupTestAccount, v2LockupContractAccount, latestLockupContractAccount;
    const dateNowNanosBN = new BN(Date.now()).mul(new BN("1000000"));
    const fullyVestedLockupConfig = {
        amount: "5.0",
        release_duration: "0",
        lockup_timestamp: dateNowNanosBN.sub(new BN("60").mul(new BN("60000000000"))).toString(), // 1 hour ago
        vesting_schedule: {
            VestingSchedule: {
                start_timestamp: dateNowNanosBN.sub(new BN("535600").mul(new BN("60000000000"))).toString(), // 1 year ago
                end_timestamp: dateNowNanosBN.sub(new BN("60").mul(new BN("60000000000"))).toString(), // 1 hour ago
                cliff_timestamp: dateNowNanosBN.sub(new BN("1051200").mul(new BN("60000000000"))).toString(), // 2 years ago
            },
        },
    };

    beforeAll(async ({ bankAccount }) => {
        v2LockupTestAccount = await bankAccount.spawnRandomSubAccountInstance().create({ amount: "6.0" });
        v2LockupContractAccount = await v2LockupTestAccount.createTestLockupSubAccountInstance({
            v2Wasm: true,
            ...fullyVestedLockupConfig,
        });
        latestLockupTestAccount = await bankAccount.spawnRandomSubAccountInstance().create({ amount: "6.0" });
        latestLockupContractAccount = await latestLockupTestAccount.createTestLockupSubAccountInstance(fullyVestedLockupConfig);
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
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.reservedForStorage",
            /3.5 NEAR/
        );
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.accountId",
            new RegExp(`${latestLockupContractAccount.accountId}`)
        );
        await expect(page).toHaveSelector("data-test-id=lockupTransferToWalletButton");
        
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
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.reservedForStorage",
            /35 NEAR/
        );
        await expect(page).toMatchText(
            "data-test-id=lockupAccount.accountId",
            new RegExp(`${v2LockupContractAccount.accountId}`)
        );
        await expect(page).toHaveSelector("data-test-id=lockupTransferToWalletButton");
    });
});
