const nearApi = require("near-api-js");

const { test, expect } = require("../playwrightWithFixtures");
const { CONTRACT } = require("../constants");
const { HomePage } = require("../register/models/Home");
const { SwapPage } = require("./models/Swap");
const { getResultMessageRegExp, removeStringBrakes } = require("./utils");
const {
    NEAR_DEPOSIT_FEE,
    NEAR_WITHDRAW_FEE,
    TRANSACTIONS_LOADING_DELAY,
} = require("./constants");

const { utils: { format } } = nearApi;
const { describe, beforeAll, afterAll } = test;
const { TESTNET } = CONTRACT;

test.setTimeout(180_000)

describe("Swap NEAR with wrapped NEAR", () => {
    const swapAmount = 1;
    const waitAfterSwapWhileBalancesLoading = 20_000;
    // Limit on amount decimals because we don't know the exact transaction fees
    const maxDecimalsToCheck = 2;
    let account;
    let totalBalanceOnStart;
    let page;
    let homePage;
    let swapPage;

    beforeAll(async ({ browser, bankAccount }) => {
        const context = await browser.newContext();

        page = await context.newPage();
        homePage = new HomePage(page);
        swapPage = new SwapPage(page);

        account = bankAccount.spawnRandomSubAccountInstance();

        await account.create();

        const { total } = await account.getUpdatedBalance();

        totalBalanceOnStart = Number(format.formatNearAmount(total));
    });

    afterAll(async () => {
        await homePage.close();
        await swapPage.close();
        await account.delete();
    });

    test("should swap NEAR for wrapped NEAR", async () => {
        await homePage.loginAndNavigate(account.accountId, account.seedPhrase);
        await swapPage.navigate();

        expect(swapPage.page).toHaveURL(/.*\/swap$/);

        await swapPage.fillForm({
            inId: TESTNET.NEAR.id,
            inAmount: swapAmount,
            outId: TESTNET.wNEAR.id,
        });

        const outInput = await swapPage.getOutputInput();
        const outAmount = await outInput.inputValue();

        expect(outAmount).toEqual(`${swapAmount}`);

        const nearBalanceBefore = await account.getUpdatedBalance();

        await swapPage.clickOnPreviewButton();
        await swapPage.confirmSwap();
        await swapPage.wait(TRANSACTIONS_LOADING_DELAY);

        const resultElement = await swapPage.waitResultMessageElement();
        const resultMessage = await resultElement.innerText();

        expect(removeStringBrakes(resultMessage)).toMatch(
            getResultMessageRegExp({
                fromSymbol: TESTNET.NEAR.symbol,
                fromAmount: swapAmount,
                toSymbol: TESTNET.wNEAR.symbol,
                toAmount: swapAmount,
            })
        );

        const nearBalanceAfter = await account.getUpdatedBalance();
        const spentInSwap = swapAmount + NEAR_DEPOSIT_FEE;
        const formattedTotalAfter = format.formatNearAmount(nearBalanceAfter.total);
        const formattedTotalBefore = format.formatNearAmount(nearBalanceBefore.total);

        expect(Number(formattedTotalAfter)).toBeCloseTo(
            formattedTotalBefore - spentInSwap,
            maxDecimalsToCheck
        );

        const wrappedNearBalance = await account.getTokenBalance(TESTNET.wNEAR.id);

        expect(Number(format.formatNearAmount(wrappedNearBalance))).toEqual(swapAmount);

        await swapPage.clickOnContinueAfterSwapButton();
    });

    test("should swap wrapped NEAR for NEAR", async () => {
        await swapPage.fillForm({
            inId: TESTNET.wNEAR.id,
            inAmount: swapAmount,
            outId: TESTNET.NEAR.id,
            initialDelay: waitAfterSwapWhileBalancesLoading,
        });

        const outInput = await swapPage.getOutputInput();
        const outAmount = await outInput.inputValue();

        expect(outAmount).toEqual(`${swapAmount}`);

        const nearBalanceBefore = await account.getUpdatedBalance();
        // Additional balance check after the first swap
        expect(Number(format.formatNearAmount(nearBalanceBefore.total))).toBeCloseTo(
            totalBalanceOnStart - swapAmount - NEAR_DEPOSIT_FEE,
            maxDecimalsToCheck
        );

        await swapPage.clickOnPreviewButton();
        await swapPage.confirmSwap();
        await swapPage.wait(TRANSACTIONS_LOADING_DELAY);

        const resultElement = await swapPage.waitResultMessageElement();
        const resultMessage = await resultElement.innerText();

        expect(removeStringBrakes(resultMessage)).toMatch(
            getResultMessageRegExp({
                fromSymbol: TESTNET.wNEAR.symbol,
                fromAmount: swapAmount,
                toSymbol: TESTNET.NEAR.symbol,
                toAmount: swapAmount,
            })
        );

        const nearBalanceAfter = await account.getUpdatedBalance();
        const formattedTotalAfter = format.formatNearAmount(nearBalanceAfter.total);
        const formattedTotalBefore = format.formatNearAmount(nearBalanceBefore.total);

        expect(Number(formattedTotalAfter)).toBeCloseTo(
            Number(formattedTotalBefore) + swapAmount - NEAR_WITHDRAW_FEE,
            maxDecimalsToCheck
        );

        const wrappedNearBalance = await account.getTokenBalance(TESTNET.wNEAR.id);

        expect(Number(format.formatNearAmount(wrappedNearBalance))).toEqual(0);
    });
});
