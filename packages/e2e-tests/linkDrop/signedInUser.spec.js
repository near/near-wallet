const { test, expect } = require("@playwright/test");
const { BN } = require("bn.js");
const { parseNearAmount, formatNearAmount } = require("near-api-js/lib/utils/format");
const { KeyPairEd25519 } = require("near-api-js/lib/utils/key_pair");

const { CreateAccountPage } = require("../register/models/CreateAccount");
const { HomePage } = require("../register/models/Home");
const { SetRecoveryOptionPage } = require("../register/models/SetRecoveryOption");
const { VerifySeedPhrasePage } = require("../register/models/VerifySeedPhrase");
const nearApiJsConnection = require("../utils/connectionSingleton");
const { generateTestAccountId, setupLinkdropAccounts } = require("../utils/account");
const { LinkDropPage } = require("./models/LinkDrop");
const { SetupSeedPhrasePage } = require("../register/models/SetupSeedPhrase");
const { WALLET_NETWORK, LINKDROP_ACCESS_KEY_ALLOWANCE } = require("../constants");

const { describe, beforeAll, afterAll, beforeEach } = test;

describe("Linkdrop flow", () => {
    let linkdropSenderAccount,
        linkdropReceiverAccount,
        linkdropContractAccount,
        linkdropSecretKey,
        linkdropNEARAmount = "2.5";

    const linkdropClaimableAmount = new BN(parseNearAmount(linkdropNEARAmount)).sub(LINKDROP_ACCESS_KEY_ALLOWANCE);

    beforeAll(async () => {
        ({
            linkdropSenderAccount,
            linkdropReceiverAccount,
            linkdropContractAccount,
            secretKey: linkdropSecretKey,
        } = await setupLinkdropAccounts(linkdropNEARAmount));
    });

    beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(linkdropReceiverAccount.accountId, linkdropReceiverAccount.seedPhrase);
    });

    afterAll(async () => {
        await Promise.allSettled([
            linkdropSenderAccount.delete(),
            linkdropReceiverAccount.delete(),
            linkdropContractAccount.delete(),
        ]);
    });

    test("navigates to linkdrop page with correct balance and accounts", async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.loginWithSeedPhraseLocalStorage(process.env.BANK_ACCOUNT, process.env.BANK_SEED_PHRASE);
        const linkdropPage = new LinkDropPage(page);
        const contractAccountId = linkdropContractAccount.accountId;
        await linkdropPage.navigate(linkdropContractAccount.accountId, linkdropSecretKey);

        await expect(page).not.toHaveSelector(".dots");
        await expect(page).toMatchURL(new RegExp(`/linkdrop/${contractAccountId}/${linkdropSecretKey}`));
        await expect(page).toMatchText(
            "data-test-id=linkdropBalanceAmount",
            new RegExp(`${formatNearAmount(linkdropClaimableAmount.toString())} NEAR`)
        );
        await expect(page).toMatchText("data-test-id=linkdropAccountDropdown", new RegExp(process.env.BANK_ACCOUNT));
        await expect(page).toMatchText("data-test-id=linkdropAccountDropdown", new RegExp(linkdropReceiverAccount.accountId));
    });
    test("adds to current account balance", async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();
        await page.waitForSelector(".dots", { state: "detached" });
        const startBalance = new BN(parseNearAmount(await homePage.getNearBalanceInNear()));
        const linkdropPage = new LinkDropPage(page);
        const endBalance = formatNearAmount(startBalance.add(linkdropClaimableAmount).toString());

        await linkdropPage.navigate(linkdropContractAccount.accountId, linkdropSecretKey);
        await expect(page).not.toHaveSelector(".dots");

        await linkdropPage.claimToExistingAccount();
        await page.waitForNavigation();

        await page.reload();

        await expect(page).not.toHaveSelector(".dots");
        await expect(page).toMatchText("data-test-id=walletHomeNearBalance", new RegExp(endBalance));
    });
    test("claims linkdrop to new account", async ({ page, context }) => {
        await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(test.skip);
        // skip test on mainnet
        if (nearApiJsConnection.config.networkId === WALLET_NETWORK.MAINNET) {
            test.skip();
        }

        const linkdropKeyPair = KeyPairEd25519.fromRandom();
        const linkdropContractTLAAccountId = "testnet";

        await linkdropSenderAccount.nearApiJsAccount.functionCall(
            linkdropContractTLAAccountId,
            "send",
            { public_key: linkdropKeyPair.publicKey.toString() },
            null,
            new BN(parseNearAmount(linkdropNEARAmount))
        );
        const linkdropPage = new LinkDropPage(page);
        await linkdropPage.navigate(linkdropContractTLAAccountId, linkdropKeyPair.secretKey);
        await linkdropPage.createAccountToClaim();

        const createAccountPage = new CreateAccountPage(page);
        await createAccountPage.acceptTerms();
        await createAccountPage.submitAccountId(generateTestAccountId());

        const setRecoveryOptionPage = new SetRecoveryOptionPage(page);
        await setRecoveryOptionPage.clickSeedPhraseRecoveryOption();
        await setRecoveryOptionPage.submitRecoveryOption();

        const setupSeedPhrasePage = new SetupSeedPhrasePage(page);
        const copiedSeedPhrase = await setupSeedPhrasePage.copySeedPhrase();
        await setupSeedPhrasePage.continueToSeedPhraseVerification();

        const verifySeedPhrasePage = new VerifySeedPhrasePage(page);
        const requestedVerificationWordNumber = await verifySeedPhrasePage.getRequestedVerificationWordNumber();
        await verifySeedPhrasePage.verifyWithWord(copiedSeedPhrase.split(" ")[requestedVerificationWordNumber - 1]);

        await expect(page).toMatchURL(/\/$/);
        await expect(page).toHaveSelector("data-test-id=linkDropSuccessModal");
    });
});
