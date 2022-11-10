const nearApi = require("near-api-js");

const { test, expect } = require("../playwrightWithFixtures");
const { CONTRACT } = require("../constants");
const { formatAmount } = require("../utils/amount");
const { HomePage } = require("../register/models/Home");
const { SwapPage } = require("./models/Swap");
const { getResultMessageRegExp, removeStringBrakes, withoutLastChars } = require("./utils");
const {
    SWAP_FEE,
    NEP141_TOKEN_PAIRS,
    TRANSACTIONS_LOADING_DELAY,
} = require("./constants");

const { utils: { format } } = nearApi;
const { describe, beforeAll, afterAll } = test;
const { TESTNET } = CONTRACT;

test.setTimeout(150_000)

describe("Swap NEP141 with NEP141", () => {
    const swapAmount = 1.5;
    const waitAfterSwapWhileBalancesLoading = 20_000;
    // Limit on amount decimals because we don't know the exact transaction fees
    const maxDecimalsToCheck = 2;
    let account;
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

    const { token0, token1 } = NEP141_TOKEN_PAIRS.TESTNET[0];

    test(`should swap ${token0.name} for ${token1.name}`, async () => {
        await homePage.loginAndNavigate(account.accountId, account.seedPhrase);
        await swapPage.navigate();

        expect(swapPage.page).toHaveURL(/.*\/swap$/);

        // At first we swap NEAR to NEP141

        await swapPage.fillForm({
            inId: TESTNET.NEAR.id,
            inAmount: swapAmount,
            outId: token0.id,
        });

        const outInput = await swapPage.getOutputInput();
        const token0OutAmount = await outInput.inputValue();
        let nearBalanceBefore = await account.getUpdatedBalance();
        let parsedTotalBefore = format.formatNearAmount(nearBalanceBefore.total);

        await swapPage.clickOnPreviewButton();
        await swapPage.confirmSwap();
        await swapPage.wait(TRANSACTIONS_LOADING_DELAY);
        await swapPage.clickOnContinueAfterSwapButton();

        let nearBalanceAfter = await account.getUpdatedBalance();
        let parsedTotalAfter = format.formatNearAmount(nearBalanceAfter.total);

        expect(Number(parsedTotalAfter)).toBeCloseTo(
            parsedTotalBefore - (swapAmount + SWAP_FEE),
            maxDecimalsToCheck
        );

        // Start swap between tokens

        const token0Balance = await account.getTokenBalance(token0.id);
        const token0ParsedBalance = formatAmount(token0Balance, token0.decimals);

        expect(token0ParsedBalance).toMatch(new RegExp(withoutLastChars(token0OutAmount, 1)))

        await swapPage.fillForm({
            inId: token0.id,
            inAmount: token0ParsedBalance,
            outId: token1.id,
            initialDelay: waitAfterSwapWhileBalancesLoading,
        });

        const token1OutInput = await swapPage.getOutputInput();
        const token1OutAmount = await token1OutInput.inputValue();
        nearBalanceBefore = await account.getUpdatedBalance();
        parsedTotalBefore = format.formatNearAmount(nearBalanceBefore.total);

        expect(Number(token1OutAmount) > 0).toBeTruthy();

        await swapPage.clickOnPreviewButton();
        await swapPage.confirmSwap();
        await swapPage.wait(TRANSACTIONS_LOADING_DELAY);

        const resultElement = await swapPage.waitResultMessageElement();
        const resultMessage = await resultElement.innerText();

        expect(removeStringBrakes(resultMessage)).toMatch(
            getResultMessageRegExp({
                fromSymbol: token0.symbol,
                fromAmount: token0OutAmount,
                toSymbol: token1.symbol,
                toAmount: token1OutAmount,
            })
        );

        await swapPage.wait(TRANSACTIONS_LOADING_DELAY);

        nearBalanceAfter = await account.getUpdatedBalance();
        parsedTotalAfter = format.formatNearAmount(nearBalanceAfter.total);

        expect(Number(parsedTotalAfter)).toBeCloseTo(
            parsedTotalBefore - SWAP_FEE,
            maxDecimalsToCheck
        );

        const token0BalanceAfter = await account.getTokenBalance(token0.id);
        const token0ParsedBalanceAfter = Number(formatAmount(token0BalanceAfter, token0.decimals));

        const token1BalanceAfter = await account.getTokenBalance(token1.id);
        const token1ParsedBalanceAfter = Number(formatAmount(token1BalanceAfter, token1.decimals));

        expect(token0ParsedBalanceAfter).toEqual(0);
        expect(token1ParsedBalanceAfter).toMatch(new RegExp(withoutLastChars(token1OutAmount, 1)))
    });
});
