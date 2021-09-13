const { test, expect } = require("@playwright/test");
const { BN } = require("bn.js");
const { readFile } = require("fs/promises");
const { parseNearAmount, formatNearAmount } = require("near-api-js/lib/utils/format");
const { KeyPairEd25519 } = require("near-api-js/lib/utils/key_pair");
const path = require("path");

const { CreateAccountPage } = require("../register/models/CreateAccount");
const { HomePage } = require("../register/models/Home");
const { SetRecoveryOptionPage } = require("../register/models/SetRecoveryOption");
const { VerifySeedPhrasePage } = require("../register/models/VerifySeedPhrase");
const { walletNetwork } = require("../utils/config");
const { createRandomBankSubAccount, generateTestAccountId, getAccountFromSeedPhrase } = require("../utils/account");
const { LinkDropPage } = require("./models/LinkDrop");
const { SetupSeedPhrasePage } = require("../register/models/SetupSeedPhrase");

const { describe, beforeAll, afterAll, beforeEach } = test;

describe("Linkdrop flow", () => {
    let linkdropSenderAccount,
        linkdropReceiverAccount,
        linkdropContractAccount,
        linkdropKeyPair,
        linkdropTransferNEARAmount = "2.5";

    const LINKDROP_ACCESS_KEY_ALLOWANCE = new BN(parseNearAmount("1.0"));
    const linkdropClaimableAmount = new BN(parseNearAmount(linkdropTransferNEARAmount)).sub(
        LINKDROP_ACCESS_KEY_ALLOWANCE
    );

    beforeAll(async () => {
        [
            { value: linkdropSenderAccount, reason: linkdropSenderAccountCreationError },
            { value: linkdropContractAccount, reason: linkdropContractAccountCreationError },
            { value: linkdropReceiverAccount },
        ] = await Promise.allSettled([
            createRandomBankSubAccount("7.0"),
            readFile(path.resolve(__dirname, "../contracts/linkdrop.wasm")).then((wasm) =>
                createRandomBankSubAccount("5.0", wasm)
            ),
            createRandomBankSubAccount(),
        ]);
        if (!linkdropContractAccount || !linkdropSenderAccount || !linkdropReceiverAccount) {
            throw new Error(
                "Cannot run test suite, linkdrop sender, receiver and contract accounts not successfully created",
                {
                    cause: linkdropContractAccountCreationError || linkdropSenderAccountCreationError,
                }
            );
        }
        linkdropKeyPair = await KeyPairEd25519.fromRandom();
        await linkdropSenderAccount.account.functionCall(
            linkdropContractAccount.account.accountId,
            "send",
            { public_key: linkdropKeyPair.publicKey.toString() },
            null,
            new BN(parseNearAmount(linkdropTransferNEARAmount))
        );
    });

    afterAll(async () => {
        await Promise.allSettled([
            linkdropSenderAccount && linkdropSenderAccount.delete(),
            linkdropReceiverAccount && linkdropReceiverAccount.delete(),
            linkdropContractAccount && linkdropContractAccount.delete(),
        ]);
    });

    test("logs in and claims linkdrop", async ({ page }) => {
        const linkdropPage = new LinkDropPage(page);

        await linkdropPage.navigate(linkdropContractAccount.account.accountId, linkdropKeyPair.secretKey);
        await expect(page).not.toHaveSelector(".dots");
        await linkdropPage.loginAndClaim();

        await page.click(`data-test-id=recoverAccountWithPassphraseButton`);
        await page.fill("data-test-id=seedPhraseRecoveryInput", linkdropReceiverAccount.seedPhrase);
        await page.click(`[type="submit"]`);
        await page.waitForNavigation();
        await linkdropPage.claimToExistingAccount();
        await page.waitForNavigation();

        await expect(page).toMatchURL(/\/$/);
        await page.reload();
        await expect(page).not.toHaveSelector(".dots");
        const nearBalance = await new HomePage(page).getNearBalanceInNear();
        await expect(new BN(parseNearAmount(nearBalance)).gte(linkdropClaimableAmount)).toBe(true);
    });
    test("claims linkdrop to new account", async ({ page, context }) => {
        await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(test.skip);
        // skip test on mainnet
        if (walletNetwork === "mainnet") {
            test.skip();
        }

        linkdropKeyPair = await KeyPairEd25519.fromRandom();
        const linkdropContractTLAAccountId = "testnet";

        await linkdropSenderAccount.account.functionCall(
            linkdropContractTLAAccountId,
            "send",
            { public_key: linkdropKeyPair.publicKey.toString() },
            null,
            new BN(parseNearAmount(linkdropTransferNEARAmount))
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
