const BN = require("bn.js");
const { parseNearAmount } = require("near-api-js/lib/utils/format");

class StakeUnstakePage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto("/staking");
    }
    async clickStakeButton() {
        await this.page.click("data-test-id=stakeMyTokensButton");
    }
    async searhForValidator(searchText) {
        await this.page.fill("data-test-id=stakingSearchForValidator", searchText);
    }
    async getFirstValidatorName() {
        return this.page.textContent("data-test-id=stakingPageValidatorItemName");
    }
    async selectFirstValidator() {
        await this.page.click("data-test-id=stakingPageSelectValidator");
    }
    async getCurrentlyDisplayedBalance() {
        const balanceString = await this.page.textContent("data-test-id=accountSelectAvailableBalance");
        return new BN(parseNearAmount(balanceString.split(" ")[0]));
    }
    async clickStakeWithValidator() {
        await this.page.click("data-test-id=validatorPageStakeButton");
    }
    async submitStakeWithAmount(amount) {
        await this.page.fill("data-test-id=stakingAmountInput", amount.toString());
        await this.page.click("data-test-id=submitStakeButton");
    }
    async confirmStakeOnModal() {
        await this.page.click("data-test-id=confirmStakeOnModalButton");
    }
    async returnToDashboard() {
        await this.page.click("data-test-id=returnToDashboardButton");
    }
}

module.exports = { StakeUnstakePage };
